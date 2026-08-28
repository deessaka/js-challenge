FROM node:24.20.0-alpine3.24 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --frozen-lockfile


# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN npm run build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
# `node ace build` bundles a self-contained app into ./build (the same
# output Render runs via `cd build && node bin/server.js`); copy that as
# the image root instead of the whole build stage, so source, tests and
# devDependencies never ship in the production image.
COPY --from=build --chown=node:node /app/build ./
COPY --from=production-deps --chown=node:node /app/node_modules ./node_modules
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/health || exit 1
CMD ["node", "./bin/server.js"]
