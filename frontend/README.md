Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
bun install
bun --bun run start
```

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## API Base URL

The frontend now defaults to same-origin requests for `/api/*` and `/uploads/*`.

- For a reverse proxy or regular domain setup, leave `VITE_API_URL` empty and route `/api` plus `/uploads` to the backend on the same host.
- For local split-host development, set `VITE_API_URL` explicitly, for example `http://localhost:8000` or `http://100.x.y.z:8000` on Tailscale.

The backend accepts `CORS_ORIGINS` either as a JSON array or a comma-separated list.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.
