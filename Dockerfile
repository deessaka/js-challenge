FROM node:20.12.2-alpine3.18 as base

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Production only deps stage
FROM base as production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
# RUN node ace build
RUN ls -la  # Debug: List all files in the current directory
RUN npm run build || (echo "Build failed" && exit 1)  # Run build command and exit if it fails
RUN node ace build || (echo "Ace build failed" && exit 1)  # Run ace build and exit if it fails


# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
