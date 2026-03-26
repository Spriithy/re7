# Re7 Deployment Environments

Re7 now uses explicit environment files so you can switch cleanly between:

- `localhost`
- `tailscale`

## Files

- `.env.example`: shared variable reference
- `.env.localhost.example`: Docker Compose values for localhost
- `.env.tailscale.example`: Docker Compose values for Tailnet access
- `docker-compose.yml`: base backend/frontend runtime

## Recommended workflow

Copy the example that matches your target environment into an ignored file, then edit the values:

```bash
cp .env.localhost.example .env.localhost
cp .env.tailscale.example .env.tailscale
```

Fill in at least:

- `WORKOS_CLIENT_ID`
- `VITE_WORKOS_CLIENT_ID`
- `VITE_WORKOS_DEV_MODE` for development deployments
- `WORKOS_API_KEY`
- `SECRET_KEY`

## Localhost

```bash
docker compose --env-file .env.localhost up --build
```

Expected URLs:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`
- health check: `http://localhost:8000/health`

The browser talks to the frontend origin only. Vite proxies `/api` and `/uploads` to the backend container using `BACKEND_PROXY_TARGET=http://backend:8000`.
For development, set `VITE_WORKOS_DEV_MODE=true` so AuthKit persists its session state across redirects on non-`localhost` origins too.

## Tailscale

Set the hostname values in `.env.tailscale` to your machine's Tailnet DNS name, then run:

```bash
docker compose --env-file .env.tailscale up --build
```

Make sure `.env.tailscale` includes both:

- `TRUSTED_HOSTS=your-machine.your-tailnet.ts.net,localhost,127.0.0.1`
- `VITE_ALLOWED_HOSTS=your-machine.your-tailnet.ts.net,localhost,127.0.0.1`
- `APP_PUBLIC_ORIGIN=https://your-machine.your-tailnet.ts.net`
- `VITE_WORKOS_REDIRECT_URI=https://your-machine.your-tailnet.ts.net/callback`
- `BACKEND_PROXY_TARGET=http://backend:8000`
- `VITE_API_URL=` (empty, so the browser uses the same origin)
- `VITE_WORKOS_DEV_MODE=true`

Expected URLs:

- frontend for browser auth: `https://<tailnet-hostname>`
- backend container: `http://backend:8000` inside Docker
- health check: `http://<tailnet-hostname>:8000/health`

The frontend container still runs on local HTTP port `3000`. Tailnet HTTPS is provided by Tailscale Serve on the host machine, not by a container in this repo. Browser API requests go to `https://<tailnet-hostname>/api/...` and are proxied server-side to the backend container.

## WorkOS Redirect URIs

Configure WorkOS so the redirect URI matches the selected frontend origin:

- localhost: `http://localhost:3000/callback`
- tailscale: `https://<tailnet-hostname>/callback`

## Tailscale Serve HTTPS

For Tailnet access, WorkOS requires a secure browser origin. Plain `http://<tailnet-hostname>:3000` is not enough because PKCE depends on Web Crypto in a secure context.

Recommended topology:

- browser -> `https://<tailnet-hostname>` via Tailscale Serve
- Tailscale Serve -> local frontend container on `http://127.0.0.1:3000`
- frontend Vite proxy -> backend container on `http://backend:8000`

Important constraints:

- Tailscale Serve is not part of this repository.
- It runs on the host machine where Tailscale is installed.
- Docker Compose still runs the frontend and backend as plain HTTP services internally.
- The browser should not call the backend origin directly from the HTTPS Tailnet frontend.

Run the Serve command on the host, with your own hostname and local port values:

```bash
tailscale serve 3000
```

Then confirm that:

- `https://<tailnet-hostname>` opens the frontend
- `APP_PUBLIC_ORIGIN` matches that HTTPS origin
- `VITE_WORKOS_REDIRECT_URI` matches `https://<tailnet-hostname>/callback`
- the same HTTPS callback URI is configured in WorkOS
- `https://<tailnet-hostname>/api/categories` returns backend data through the frontend proxy
- the WorkOS session survives the callback redirect and `/` no longer bounces back to `/login`

## Troubleshooting

Symptom:

- login or signup fails with `crypto.subtle is undefined`
- API requests fail as mixed content from an HTTPS frontend

Cause:

- Re7 was opened on an insecure origin such as `http://<tailnet-hostname>:3000`
- the frontend was configured to call `http://<tailnet-hostname>:8000` directly from an HTTPS page

Fix:

- open Re7 at `https://<tailnet-hostname>` through Tailscale Serve
- or use `http://localhost:3000` directly on the same machine
- leave `VITE_API_URL` empty and use the frontend proxy for `/api` and `/uploads`

## Switching environments

Use `--env-file` to choose the deployment target explicitly:

```bash
docker compose --env-file .env.localhost up --build
docker compose --env-file .env.tailscale up --build
```
