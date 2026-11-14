pipeline {
  agent any

  parameters {
    string(
      name: "SOURCE_REF",
      defaultValue: "main",
      description: "PluralBuddy branch to build."
    )
    booleanParam(
      name: "FORCE_DEPLOY",
      defaultValue: false,
      description: "Build/push even when SOURCE_REF is not main, or this commit was already built (emergency only)."
    )
  }

  triggers {
    // No webhook access on giftedl/PluralBuddy; poll it instead.
    pollSCM("H/5 * * * *")
  }

  options {
    disableConcurrentBuilds()
    timestamps()
    timeout(time: 45, unit: "MINUTES")
  }

  environment {
    DEPLOY_BRANCH = "main"
    SOURCE_REPO = "https://github.com/giftedl/PluralBuddy.git"
    BOT_IMAGE_REPO = "ghcr.io/florality-application/pluralbuddy-bot"
    WEB_IMAGE_REPO = "ghcr.io/florality-application/pluralbuddy-web"
    // Per-build registry login so other jobs' `docker logout` can't break the push.
    // Kept in @tmp so it is never part of the docker build context.
    DOCKER_CONFIG = "${WORKSPACE}@tmp/docker-config"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout(scm: scm, poll: false, changelog: false)
        dir("src") {
          git(url: env.SOURCE_REPO, branch: params.SOURCE_REF ?: env.DEPLOY_BRANCH)
        }
      }
    }

    stage("Prepare metadata") {
      steps {
        script {
          env.EFFECTIVE_BRANCH = params.SOURCE_REF?.trim() ?: env.DEPLOY_BRANCH
          env.GIT_SHA = sh(
            script: "git -C src rev-parse HEAD",
            returnStdout: true
          ).trim()
          env.BUILD_TS = sh(
            script: "date +%s",
            returnStdout: true
          ).trim()
          env.IMAGE_TAG = "ts-${env.BUILD_TS}-sha-${env.GIT_SHA}"
          // Also pushed: sha-<sha>. ImagePolicies only match ts-*, so this tag is
          // just the "already built" marker checked below.
          env.SHA_TAG = "sha-${env.GIT_SHA}"
          echo "Branch=${env.EFFECTIVE_BRANCH} sha=${env.GIT_SHA}"
          echo "Flux will pick up: ${env.BOT_IMAGE_REPO}:${env.IMAGE_TAG} and ${env.WEB_IMAGE_REPO}:${env.IMAGE_TAG}"
        }
      }
    }

    stage("Verify deploy branch") {
      steps {
        script {
          if (params.FORCE_DEPLOY != true && env.EFFECTIVE_BRANCH != env.DEPLOY_BRANCH) {
            error(
              "Refusing build: branch '${env.EFFECTIVE_BRANCH}' is not '${env.DEPLOY_BRANCH}'. " +
              "Set FORCE_DEPLOY to build from another branch."
            )
          }
        }
      }
    }

    stage("Verify Dockerfiles") {
      steps {
        script {
          for (f in ["src/Dockerfile", "docker/web.Dockerfile"]) {
            if (!fileExists(f)) {
              error("Missing ${f} in workspace.")
            }
          }
        }
      }
    }

    stage("Registry login") {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: "florality-application-ghcr-push",
            usernameVariable: "GHCR_USER",
            passwordVariable: "GHCR_TOKEN"
          )
        ]) {
          sh """
            set -eu
            mkdir -p "\$DOCKER_CONFIG"
            # buildx may live under the agent's ~/.docker/cli-plugins.
            if [ -d "\$HOME/.docker/cli-plugins" ]; then
              ln -sfn "\$HOME/.docker/cli-plugins" "\$DOCKER_CONFIG/cli-plugins"
            fi
            echo "\$GHCR_TOKEN" | docker login ghcr.io -u "\$GHCR_USER" --password-stdin
          """
        }
      }
    }

    stage("Check already built") {
      steps {
        script {
          def botBuilt = sh(
            script: "docker manifest inspect ${env.BOT_IMAGE_REPO}:${env.SHA_TAG} >/dev/null 2>&1",
            returnStatus: true
          ) == 0
          def webBuilt = sh(
            script: "docker manifest inspect ${env.WEB_IMAGE_REPO}:${env.SHA_TAG} >/dev/null 2>&1",
            returnStatus: true
          ) == 0
          env.ALREADY_BUILT = (botBuilt && webBuilt && params.FORCE_DEPLOY != true) ? "true" : "false"
          if (env.ALREADY_BUILT == "true") {
            echo "${env.GIT_SHA} is already in GHCR (${env.SHA_TAG}); nothing to build. Set FORCE_DEPLOY to rebuild."
          }
        }
      }
    }

    stage("Build and push images") {
      when {
        expression { return env.ALREADY_BUILT != "true" }
      }
      steps {
        parallel(
          "bot": {
            sh """
              set -eu
              DOCKER_BUILDKIT=1 docker build --progress=plain \\
                --build-arg GIT_COMMIT=${GIT_SHA} \\
                -f src/Dockerfile \\
                -t ${BOT_IMAGE_REPO}:${IMAGE_TAG} -t ${BOT_IMAGE_REPO}:${SHA_TAG} src
              docker push ${BOT_IMAGE_REPO}:${IMAGE_TAG}
              docker push ${BOT_IMAGE_REPO}:${SHA_TAG}
            """
          },
          "web": {
            sh """
              set -eu
              DOCKER_BUILDKIT=1 docker build --progress=plain \\
                --build-arg GIT_COMMIT=${GIT_SHA} \\
                -f docker/web.Dockerfile \\
                -t ${WEB_IMAGE_REPO}:${IMAGE_TAG} -t ${WEB_IMAGE_REPO}:${SHA_TAG} src
              docker push ${WEB_IMAGE_REPO}:${IMAGE_TAG}
              docker push ${WEB_IMAGE_REPO}:${SHA_TAG}
            """
          }
        )
      }
    }

    stage("Flux handoff summary") {
      when {
        expression { return env.ALREADY_BUILT != "true" }
      }
      steps {
        echo """
============================================================
GHCR images pushed — Flux will roll these out to k8s:
  bot: ${BOT_IMAGE_REPO}:${IMAGE_TAG}
  web: ${WEB_IMAGE_REPO}:${IMAGE_TAG}

ImagePolicies: flux-system:pluralbuddy-bot , flux-system:pluralbuddy-web
Watch: kubectl get hpa,deploy,pods -n pluralbuddy
============================================================
"""
      }
    }
  }

  post {
    always {
      echo "Bot image: ${BOT_IMAGE_REPO}:${IMAGE_TAG}"
      echo "Web image: ${WEB_IMAGE_REPO}:${IMAGE_TAG}"
      sh '''
        docker image prune -af --filter "until=168h" || true
        docker builder prune -af --filter "until=168h" || true
        rm -rf "$DOCKER_CONFIG"
      '''
    }
  }
}

