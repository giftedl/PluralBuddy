# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/pluralbuddy

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
RUN mkdir -p /temp/dev/packages/bot
RUN mkdir -p /temp/dev/packages/plurography
COPY package.json /temp/dev/
COPY packages/bot/package.json /temp/dev/packages/bot
COPY packages/plurography/package.json /temp/dev/packages/plurography
RUN cd /temp/dev && bun install --force
RUN cd /temp/dev/packages/bot && bun install --force

# install with --production (exclude devDependencies)
RUN mkdir -p /usr/pluralbuddy/
RUN mkdir -p /usr/pluralbuddy/packages/bot
RUN mkdir -p /usr/pluralbuddy/packages/plurography
COPY package.json /usr/pluralbuddy/
COPY packages/bot/package.json /usr/pluralbuddy/packages/bot
COPY packages/plurography/package.json /usr/pluralbuddy/packages/plurography
RUN cd /usr/pluralbuddy/ && bun install --force
RUN cd /usr/pluralbuddy/packages/bot && bun install --force

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /usr/pluralbuddy/node_modules node_modules
COPY --from=prerelease /usr/pluralbuddy/packages ./packages
# Bun keeps deps under root node_modules/.bun and symlinks from each workspace package; COPY ./packages above would omit these, breaking imports (e.g. seyfert).
COPY --from=install /usr/pluralbuddy/packages/bot/node_modules ./packages/bot/node_modules
COPY --from=install /usr/pluralbuddy/packages/plurography/node_modules ./packages/plurography/node_modules
COPY --from=prerelease /usr/pluralbuddy/package.json .
COPY --from=prerelease /usr/pluralbuddy/tsconfig.json .

# change ownership of the working directory to bun user so it can write files
RUN chown -R bun:bun /usr/pluralbuddy

# run the app
USER bun
EXPOSE 8080
ENTRYPOINT [ "bun", "run", "bot" ]