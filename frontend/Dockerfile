FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then bun run build && exec bunx vite preview --host 0.0.0.0 --port ${FRONTEND_PORT:-3000}; fi; exec bunx vite dev --host 0.0.0.0 --port ${FRONTEND_PORT:-3000}"]
