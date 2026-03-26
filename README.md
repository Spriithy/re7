# Re7 Deployment Environments

Re7 supports three deployment contexts:

- `localhost`
- `tailscale`
- `production` behind a shared VPS-level Caddy

## Files

- [.env.example](/home/debian/Re7/.env.example): shared variable reference
- [.env.localhost.example](/home/debian/Re7/.env.localhost.example): localhost Compose values
- [.env.tailscale.example](/home/debian/Re7/.env.tailscale.example): Tailnet Compose values
- [.env.vps.example](/home/debian/Re7/.env.vps.example): production Compose values for a shared-Caddy VPS
- [docker-compose.yml](/home/debian/Re7/docker-compose.yml): base backend/frontend runtime
- [docker-compose.prod.yml](/home/debian/Re7/docker-compose.prod.yml): production override
- [deploy/caddy/re7.example.com.Caddyfile](/home/debian/Re7/deploy/caddy/re7.example.com.Caddyfile): host-level Caddy snippet example

## Recommended Workflow

Copy the example that matches the target environment into an ignored file, then edit the values:

```bash
cp .env.localhost.example .env.localhost
cp .env.tailscale.example .env.tailscale
cp .env.vps.example .env.vps
```

Fill in at least:

- `WORKOS_CLIENT_ID`
- `VITE_WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `SECRET_KEY`

## Localhost

```bash
docker compose --env-file .env.localhost up --build
```

Expected URLs:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`
- liveness: `http://localhost:8000/health/live`
- readiness: `http://localhost:8000/health/ready`

The browser talks to the frontend origin only. Vite proxies `/api`, `/uploads`, and `/health` to the backend container using `BACKEND_PROXY_TARGET=http://backend:8000`.

## Tailscale

Set the hostname values in `.env.tailscale` to the machine's Tailnet DNS name, then run:

```bash
docker compose --env-file .env.tailscale up --build
```

Important values:

- `TRUSTED_HOSTS=your-machine.your-tailnet.ts.net,localhost,127.0.0.1`
- `VITE_ALLOWED_HOSTS=your-machine.your-tailnet.ts.net,localhost,127.0.0.1`
- `APP_PUBLIC_ORIGIN=https://your-machine.your-tailnet.ts.net`
- `VITE_WORKOS_REDIRECT_URI=https://your-machine.your-tailnet.ts.net/callback`
- `BACKEND_PROXY_TARGET=http://backend:8000`
- `VITE_API_URL=`
- `VITE_WORKOS_DEV_MODE=true`

Expected URLs:

- frontend for browser auth: `https://<tailnet-hostname>`
- backend container: `http://backend:8000` inside Docker
- liveness: `http://<tailnet-hostname>:8000/health/live`
- readiness: `http://<tailnet-hostname>:8000/health/ready`

The frontend container still runs on local HTTP port `3000`. Tailnet HTTPS is provided by Tailscale Serve on the host machine, not by a container in this repo.

## WorkOS Redirect URIs

Configure WorkOS so the redirect URI matches the selected frontend origin:

- localhost: `http://localhost:3000/callback`
- tailscale: `https://<tailnet-hostname>/callback`
- production: `https://re7.example.com/callback`

## Production

Production assumes one shared Caddy instance already exists on the VPS and handles multiple sites such as `blog.example.com`, `re7.example.com`, and others.

Re7 production does not bind `80/443` and does not run its own public reverse proxy. Instead:

- the frontend is published on loopback only, by default `127.0.0.1:3400`
- the backend is not published on the host
- the frontend proxies `/api`, `/uploads`, and `/health` internally to the backend container
- the shared host Caddy proxies the public hostname to the Re7 frontend loopback port

Start the app stack:

```bash
cp .env.vps.example .env.vps
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml build
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend alembic upgrade head
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Default production networking:

- public hostname: `https://$APP_DOMAIN`
- loopback frontend upstream for host Caddy: `127.0.0.1:${FRONTEND_PUBLIC_PORT:-3400}`

Minimal host-level Caddy site block example:

```caddyfile
re7.example.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:3400
}
```

See:

- [deploy/caddy/README.md](/home/debian/Re7/deploy/caddy/README.md)
- [docs/production-runbook.md](/home/debian/Re7/docs/production-runbook.md)

## Switching Environments

Use `--env-file` to choose the deployment target explicitly:

```bash
docker compose --env-file .env.localhost up --build
docker compose --env-file .env.tailscale up --build
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up --build
```
