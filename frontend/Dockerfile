FROM oven/bun:1

ARG GIT_SHA=dev

LABEL org.opencontainers.image.revision=$GIT_SHA

ENV HOME=/home/bun \
    APP_GIT_SHA=$GIT_SHA

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN mkdir -p /app/dist /app/node_modules/.vite /app/node_modules/.vite-temp \
    && chown -R bun:bun /app/dist /app/node_modules/.vite /app/node_modules/.vite-temp

EXPOSE 3000

USER bun

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then bun run build && exec bunx vite preview --host 0.0.0.0 --port ${FRONTEND_PORT:-3000}; fi; exec bunx vite dev --host 0.0.0.0 --port ${FRONTEND_PORT:-3000}"]
