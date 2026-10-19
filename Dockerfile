# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.4.3 AS base
WORKDIR /bot

COPY package.json bun.lock ./

# These are the 3 main packages we need
# to create the bot
RUN mkdir -p packages/bot/src
RUN mkdir -p packages/bot/content
RUN mkdir -p packages/plurography/src
RUN mkdir -p packages/tests/src

COPY packages/bot/package.json packages/bot/tsconfig.json packages/bot/seyfert.config.ts packages/bot/
COPY packages/bot/src packages/bot/src
COPY packages/bot/content packages/bot/content

COPY packages/plurography/package.json packages/plurography/tsconfig.json packages/plurography/
COPY packages/plurography/src packages/plurography/src/

COPY packages/tests/package.json packages/tests/tsconfig.json packages/tests/
COPY packages/tests/src packages/tests/src/

RUN bun install
# RUN cd packages/tests && bun test

ARG GIT_COMMIT
ENV SOURCE_COMMIT=$GIT_COMMIT

# run the app
USER bun
EXPOSE 8080

ENTRYPOINT [ "bun", "run", "bot" ]