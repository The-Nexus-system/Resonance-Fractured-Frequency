# Resonance Frequency — from-source build for the PARKED PRIVATE Fly copy
# (app: nexus-resonance-frequency). fly.toml deliberately declares no
# [[services]] / [http_service], so Fly allocates no public IPs for this app.
#
# Stage 1 builds the workspace at /home/runner/workspace — the same absolute
# path the app was built at on Replit. This matters: the API server's esbuild
# bundle bakes its build-time output directory into its pino worker paths
# (pinoBundlerAbsolutePath), so building anywhere else would produce a bundle
# whose workers point at a nonexistent path.
FROM node:22-slim AS build
WORKDIR /home/runner/workspace
RUN npm install -g pnpm@10.34.9
COPY . .
RUN pnpm install --frozen-lockfile --prod=false
# vite.config.ts requires PORT and BASE_PATH to be set even for a build.
ENV NODE_ENV=production PORT=8080 BASE_PATH=/
RUN pnpm --filter @workspace/api-server run build \
 && pnpm --filter @workspace/resonance run build

# Stage 2: slim runtime mirroring the verified parked layout — API dist at its
# baked absolute path, web frontend + wrapper under /app. No node_modules are
# needed: the API bundle is self-contained (same as the parked snapshot copy).
FROM node:22-slim
WORKDIR /app
COPY --from=build /home/runner/workspace/artifacts/api-server/dist/ /home/runner/workspace/artifacts/api-server/dist/
COPY --from=build /home/runner/workspace/artifacts/resonance/dist/public/ /app/web/
COPY deploy/server.mjs /app/server.mjs
ENV NODE_ENV=production PORT=8080
CMD ["node", "/app/server.mjs"]
