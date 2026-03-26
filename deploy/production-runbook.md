# Re7 Production Runbook

## Topology

- One VPS
- One shared host-level `cloudflared` instance for all public sites on the machine
- One shared host-level Caddy instance for all local hostname routing on the machine
- Re7 deployed with `docker compose`
- Re7 frontend published on loopback only, default `127.0.0.1:3400`
- Re7 backend reachable only from the frontend container on the internal Docker network
- SQLite on `backend_data`
- Uploads on `backend_uploads`
- Backups on `backend_backups` or a host path mounted to `/app/backups`

Public traffic flow:

1. Browser connects to `https://re7.example.com`
2. Cloudflare terminates public TLS
3. Shared VPS `cloudflared` forwards `re7.example.com` to `http://re7.internal`
4. Shared VPS Caddy matches the public hostname and proxies to `127.0.0.1:3400`
5. Re7 frontend handles page requests and proxies `/api`, `/uploads`, and `/health` to the backend container

## Initial VPS Setup

1. Install Docker Engine with the Compose plugin.
2. Create a non-root deploy user with SSH key auth only.
3. Disable password SSH auth in `/etc/ssh/sshd_config`.
4. Keep SSH reachable through Tailscale only and avoid exposing it on the public internet.
5. Enable automatic security updates if that matches your baseline.
6. Install and enable fail2ban.
7. Install and configure one shared host-level `cloudflared` service for all sites on that VPS.
8. Install and configure one shared Caddy on the host for all sites on that VPS.

Public ingress is provided by the host-level Cloudflare Tunnel setup, not by Re7 opening public host ports.

## DNS And TLS

1. Create a proxied DNS record for the Re7 hostname that is bound to the shared Cloudflare Tunnel.
2. Copy [.env.vps.example](/home/debian/Re7/.env.vps.example) to `.env.vps`.
3. Set `APP_DOMAIN` to the Re7 public hostname.
4. Configure the shared host `cloudflared` service to route `re7.example.com` to `http://re7.internal`.
5. Ensure `re7.internal` resolves locally on the VPS to the shared host Caddy listener.
6. Add a site block for Re7 to the shared host Caddy config.
7. Reload Caddy after the Re7 site block is added.

Cloudflare handles public TLS for the supported production path. Shared host Caddy acts as a local hostname router and reverse proxy behind the tunnel.

## Secrets Checklist

- `SECRET_KEY`
- `WORKOS_CLIENT_ID`
- `VITE_WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `APP_DOMAIN`

## Shared Caddy Config

Shared host Caddy receives Re7 requests from the shared host `cloudflared` service and proxies them to the Re7 loopback frontend port.

Minimal site block:

```caddyfile
re7.example.com {
  encode gzip zstd

  log {
    output stdout
    format json
  }

  reverse_proxy 127.0.0.1:3400
}
```

If `FRONTEND_PUBLIC_PORT` changes, update the Caddy upstream to match.

The shared host `cloudflared` service should route `re7.example.com` to `http://re7.internal`.

Reference files:

- [deploy/caddy/re7.example.com.Caddyfile](/home/debian/Re7/deploy/caddy/re7.example.com.Caddyfile)
- [deploy/caddy/README.md](/home/debian/Re7/deploy/caddy/README.md)

## First Deploy

1. `cp .env.vps.example .env.vps`
2. Edit `.env.vps`.
3. Confirm the shared host `cloudflared` route sends `re7.example.com` to `http://re7.internal`.
4. Confirm `re7.internal` resolves locally on the VPS to the shared host Caddy listener.
5. Add the Re7 site block to the shared host Caddy config.
6. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml build`
7. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend alembic upgrade head`
8. Optional first-time seed:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/seed_default_categories.py`
9. Optional first admin:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/create_admin.py`
10. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up -d`
11. Reload host Caddy if the site block changed.
12. Verify the local route:
   `curl -fsS -H 'Host: re7.example.com' http://re7.internal/health/live`
13. Check:
   `curl -fsS https://$APP_DOMAIN/health/live`
   `curl -fsS https://$APP_DOMAIN/health/ready`

## Normal Deploy

1. Run a backup:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/backup.py`
2. `git pull`
3. Confirm the shared host `cloudflared` route and Re7 Caddy vhost are still present.
4. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml build`
5. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend alembic upgrade head`
6. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up -d`
7. Check `curl -fsS -H 'Host: re7.example.com' http://re7.internal/health/ready`
8. Check `https://$APP_DOMAIN/health/ready`
9. Run the smoke test checklist below.

## Rollback

1. Check the previous git revision: `git log --oneline -n 5`
2. `git checkout <previous-good-sha>`
3. Rebuild and restart with the same production compose command.
4. If a migration introduced an incompatible schema change, restore the matching database and uploads backup pair before restarting.

## Nightly Backup

Recommended cron entry on the VPS host:

```cron
0 2 * * * cd /srv/re7 && docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/backup.py >> /var/log/re7-backup.log 2>&1
```

Artifacts created per day:

- `re7_YYYY-MM-DD.db.gz`
- `re7_uploads_YYYY-MM-DD.tar.gz`

Retention:

- last 7 daily backups
- last backup of each month

## Backup Verification

1. Confirm the two artifacts exist for the same date.
2. Check the backup log for `backup_completed`.
3. Periodically restore onto a fresh checkout or staging VPS and verify the app starts.

## Full Restore

1. Stop the stack:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml down`
2. Restore the matching backup pair:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/restore.py --db-backup /app/backups/re7_YYYY-MM-DD.db.gz --uploads-backup /app/backups/re7_uploads_YYYY-MM-DD.tar.gz`
3. Start the stack again.
4. Check readiness and smoke-test login, recipe list, and image rendering.

## Uploads-Only Restore

```bash
docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend \
  python scripts/restore.py \
  --uploads-backup /app/backups/re7_uploads_YYYY-MM-DD.tar.gz
```

Use a matching database artifact whenever possible so DB rows and files stay consistent.

## Admin Recovery

If the only admin account is lost:

1. Stop user-facing changes if needed.
2. Run `python scripts/create_admin.py` inside the backend container against the current database.
3. Confirm the new admin can log in and create invites.

## Host Access Verification

- `tailscale status`
- `fail2ban-client status`
- `ss -tulpn | rg ':3400|:8000'`
- `curl -fsS -H 'Host: re7.example.com' http://re7.internal/health/live`

Expected result:

- shared host `cloudflared` provides public ingress for the hostname
- shared host Caddy serves the `re7.example.com` vhost for local tunnel traffic
- Re7 frontend binds loopback only on `127.0.0.1:${FRONTEND_PUBLIC_PORT:-3400}`
- Re7 backend is not exposed on the host
- SSH stays reachable through Tailscale rather than direct public exposure

## Smoke Test Checklist

- `https://$APP_DOMAIN` loads
- `/health/live` returns 200
- `/health/ready` returns 200
- login succeeds
- logout clears the session
- recipe list loads
- recipe create or edit works
- image upload works
- `/uploads/...` images render
- admin invite flow works

## Common Incident Checks

- shared host `cloudflared` logs and tunnel config
- host Caddy logs for the Re7 vhost
- `docker compose ... logs frontend`
- `docker compose ... logs backend`
- confirm `alembic upgrade head` ran before restart
- confirm the uploads volume is mounted and writable
- confirm the SQLite file exists at the configured `DATABASE_URL`

## Security Notes

- Re7 does not expose public `80/443` itself in the supported VPS deployment path.
- Shared host `cloudflared` and shared host Caddy are expected to be managed outside this repo.
- Keep SSH and other admin access on Tailscale-only routes.
