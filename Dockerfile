FROM node:20.12.2-alpine3.18 as base

# All deps stage
FROM base as deps
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
ADD package.json package-lock.json ./
RUN npm ci --omit=dev
SHELL [ "node ace migration:run --force" ]
# Build stage
FROM base as build
COPY --from=deps ./node_modules ./node_modules
ADD . .
RUN npm run build --production && node ace migration:run --force

# Production stage
FROM base
ENV NODE_ENV=production 
WORKDIR /app
COPY --from=production-deps ./node_modules ./node_modules
COPY --from=build ./build ./
EXPOSE 8080
CMD ["node", "./bin/server.js"]
