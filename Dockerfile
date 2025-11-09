# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/pluralbuddy

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
RUN mkdir -p /temp/dev/packages/bot
RUN mkdir -p /temp/dev/packages/pluralkit-types
COPY package.json bun.lock /temp/dev/
COPY packages/bot/package.json /temp/dev/packages/bot
COPY packages/pluralkit-types/package.json /temp/dev/packages/pluralkit-types
RUN cd /temp/dev && bun install
RUN cd /temp/dev/packages/bot && bun install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
RUN mkdir -p /temp/prod/packages/bot
RUN mkdir -p /temp/prod/packages/pluralkit-types
COPY package.json bun.lock /temp/prod/
COPY packages/bot/package.json /temp/prod/packages/bot
COPY packages/pluralkit-types/package.json /temp/prod/packages/pluralkit-types
RUN cd /temp/prod && bun install
RUN cd /temp/prod/packages/bot && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/pluralbuddy/packages ./packages
COPY --from=prerelease /usr/pluralbuddy/package.json .
COPY --from=prerelease /usr/pluralbuddy/tsconfig.json .

# change ownership of the working directory to bun user so it can write files
RUN chown -R bun:bun /usr/pluralbuddy

# run the app
USER bun
ENTRYPOINT [ "bun", "run", "bot" ]