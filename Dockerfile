FROM node:20.12.2-alpine3.18 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --frozen-lockfile


# Production only deps stage
FROM base AS production-deps
WORKDIR /
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /
COPY --from=deps /node_modules /node_modules
ADD . .
RUN npm run build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /
COPY --from=production-deps /node_modules /node_modules
COPY --from=build / /
EXPOSE 8080
CMD ["node", "./bin/server.js"]
