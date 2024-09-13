FROM node:20.12.2-alpine3.18 as base

# All deps stage
FROM base as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
# RUN npm run build && tsc --noEmitOnError
RUN npm run build && node ace build --ignore-ts-errors

# Production stage
FROM base
ENV NODE_ENV=production
ENV PORT=3333
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
RUN chown -R node:node /app
USER node
EXPOSE $PORT
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node ace healthcheck || exit 1
CMD ["node", "./bin/server.js"]
