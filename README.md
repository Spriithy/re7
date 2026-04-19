# Re7 Deployment Environments

Re7 supports three deployment contexts:

- `localhost`
- `tailscale`
- `production` behind a shared VPS-level Cloudflare Tunnel and Caddy

## Files

- [.env.example](/home/debian/Re7/.env.example): shared variable reference
- [.env.localhost.example](/home/debian/Re7/.env.localhost.example): localhost Compose values
- [.env.tailscale.example](/home/debian/Re7/.env.tailscale.example): Tailnet Compose values
- [.env.vps.example](/home/debian/Re7/.env.vps.example): production Compose values for a shared-Caddy VPS behind Cloudflare Tunnel
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

## Make Targets

The repo ships with a root [Makefile](/home/debian/Re7/Makefile) for the common local checks and production deploy flow.

```bash
make check
make test
make local-up
make tailscale-up
make prod-deploy
make prod-version
```

Production builds stamp both images with the current git SHA and expose it as `APP_GIT_SHA` inside the running containers. `make prod-deploy` rebuilds with the current SHA, runs migrations, and recreates the containers so the new images are actually running.

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

Production assumes the VPS already has:

- one shared host-level `cloudflared` service for all public sites
- one shared host-level Caddy instance for all local hostname routing
- Tailscale for admin access such as SSH

Host prerequisites:

- Docker Engine with the Compose plugin
- shared host Caddy
- shared host `cloudflared`
- Tailscale for admin access
- local DNS or an `/etc/hosts` entry that maps `re7.internal` to the shared host Caddy listener

Re7 production does not bind public `80/443` and does not run its own public reverse proxy. Instead:

- the frontend is published on loopback only, by default `127.0.0.1:3400`
- the backend is not published on the host
- the frontend proxies `/api`, `/uploads`, and `/health` internally to the backend container
- shared host `cloudflared` forwards `re7.example.com` to `http://re7.internal`
- shared host Caddy receives the request locally and proxies `re7.example.com` to the Re7 frontend loopback port
- Cloudflare terminates public TLS

Start the app stack:

```bash
cp .env.vps.example .env.vps
make prod-build
make prod-migrate
make prod-up
```

For one-off bootstrap tasks, the backend image accepts entrypoint flags:

```bash
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend --migrate
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend --migrate --seed
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm -e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=change-me backend --migrate --create-admin
```

If you want to start the backend container itself with flags, override the service command for that start:

```bash
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm --service-ports backend --migrate --seed
```

For a persistent stack start with the same behavior, set the backend service command temporarily to `["--migrate", "--seed"]` and then run `docker compose ... up -d`.

Default production networking:

- public hostname: `https://$APP_DOMAIN`
- local Cloudflare Tunnel origin: `http://re7.internal`
- loopback frontend upstream for shared host Caddy: `127.0.0.1:${FRONTEND_PUBLIC_PORT:-3400}`

Supported production request flow:

1. Browser connects to `https://$APP_DOMAIN`
2. Cloudflare terminates public TLS
3. shared host `cloudflared` forwards the hostname to `http://re7.internal`
4. shared host Caddy matches `Host: $APP_DOMAIN`
5. shared host Caddy proxies to `127.0.0.1:${FRONTEND_PUBLIC_PORT:-3400}`
6. the Re7 frontend handles page requests and proxies `/api`, `/uploads`, and `/health` to the backend container

Minimal host-level Caddy site block for Re7:

```caddyfile
re7.example.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:3400
}
```

The shared host `cloudflared` service should route `re7.example.com` to `http://re7.internal`.

See:

- [deploy/caddy/README.md](/home/debian/Re7/deploy/caddy/README.md)
- [deploy/production-runbook.md](/home/debian/Re7/deploy/production-runbook.md)

## Switching Environments

Use `--env-file` to choose the deployment target explicitly:

```bash
docker compose --env-file .env.localhost up --build
docker compose --env-file .env.tailscale up --build
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up --build
```
