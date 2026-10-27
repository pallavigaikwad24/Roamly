# syntax=docker/dockerfile:1

# Single-image build: Vite compiles the React app, then Express serves both the
# API and the built client on one port. Node is pinned to 20 (LTS) because
# bcrypt 5.1.1 ships prebuilt binaries for that ABI; newer majors may compile
# from source or fail outright.

# ---------------------------------------------------------------- base deps --
# bcrypt is a native module, so the toolchain has to be present when npm builds
# it. It lives only in this stage and never reaches the runtime image.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# -------------------------------------------------------------- client build --
FROM deps AS client-build
WORKDIR /app
COPY Client/ ./Client/

# Client/vite.config.js sets envDir to the repo root, so Vite reads /app/.env*
# rather than Client/.env. The real .env is excluded by .dockerignore (it holds
# secrets), so the build-time values are written here instead.
#
# VITE_BACKEND_URL is deliberately empty: the client composes requests as
# `${url}/hotel/...`, so an empty base makes them relative and same-origin,
# which removes CORS from the picture entirely.
ARG VITE_BACKEND_URL=""
ARG VITE_COUNTRY_API="https://restcountries.com/v3.1/all?fields=name"
RUN printf 'VITE_BACKEND_URL=%s\nVITE_COUNTRY_API=%s\n' \
      "$VITE_BACKEND_URL" "$VITE_COUNTRY_API" > /app/.env.production \
    && npx vite build Client \
    && rm /app/.env.production

# ----------------------------------------------------------- runtime deps --
FROM deps AS prod-deps
WORKDIR /app
RUN npm ci --omit=dev

# ------------------------------------------------------------------ runtime --
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Ownership is set during extraction. A `RUN chown -R` instead would rewrite
# every one of the ~380MB of dependencies into an extra layer, which measured
# at 8 minutes of build time and roughly doubled the image size.
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node Server/ ./Server/
COPY --from=client-build --chown=node:node /app/Client/dist ./Client/dist

USER node

# Uploads and logs are written at runtime, so they must exist and be writable
# even when no volume is mounted. Created after USER so they belong to node.
RUN mkdir -p Server/public/hotelPictures/temp Server/public/hotelPictures/upload Server/public/logs

EXPOSE 3000

# Node 20 has fetch built in, so this needs no curl in the image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "Server/index.js"]
