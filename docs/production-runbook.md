# Re7 Production Runbook

## Topology

- One VPS
- One shared host-level Caddy instance for all public sites on the machine
- Re7 deployed with `docker compose`
- Re7 frontend published on loopback only, default `127.0.0.1:3400`
- Re7 backend reachable only from the frontend container on the internal Docker network
- SQLite on `backend_data`
- Uploads on `backend_uploads`
- Backups on `backend_backups` or a host path mounted to `/app/backups`

Public traffic flow:

1. Browser connects to `https://re7.example.com`
2. Shared VPS Caddy terminates TLS
3. Shared VPS Caddy proxies all requests to `127.0.0.1:3400`
4. Re7 frontend handles page requests and proxies `/api`, `/uploads`, and `/health` to the backend container

## Initial VPS Setup

1. Install Docker Engine with the Compose plugin.
2. Create a non-root deploy user with SSH key auth only.
3. Disable password SSH auth in `/etc/ssh/sshd_config`.
4. Enable UFW:
   `ufw allow OpenSSH`
   `ufw allow 80/tcp`
   `ufw allow 443/tcp`
   `ufw enable`
5. Enable automatic security updates if that matches your baseline.
6. Install and enable fail2ban.
7. Install and configure one shared Caddy on the host for all sites on that VPS.

## DNS And TLS

1. Point `A` or `AAAA` records for the Re7 hostname to the VPS.
2. Copy [.env.vps.example](/home/debian/Re7/.env.vps.example) to `.env.vps`.
3. Set `APP_DOMAIN` to the Re7 public hostname.
4. Add a site block for Re7 to the shared host Caddy config.
5. Reload Caddy after the Re7 site block is added.

## Secrets Checklist

- `SECRET_KEY`
- `WORKOS_CLIENT_ID`
- `VITE_WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `APP_DOMAIN`

## Shared Caddy Config

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

Reference files:

- [deploy/caddy/re7.example.com.Caddyfile](/home/debian/Re7/deploy/caddy/re7.example.com.Caddyfile)
- [deploy/caddy/README.md](/home/debian/Re7/deploy/caddy/README.md)

## First Deploy

1. `cp .env.vps.example .env.vps`
2. Edit `.env.vps`.
3. Add the Re7 site block to the shared host Caddy config.
4. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml build`
5. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend alembic upgrade head`
6. Optional first-time seed:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/seed_default_categories.py`
7. Optional first admin:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/create_admin.py`
8. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up -d`
9. Reload host Caddy if the site block changed.
10. Check:
   `curl -fsS https://$APP_DOMAIN/health/live`
   `curl -fsS https://$APP_DOMAIN/health/ready`

## Normal Deploy

1. Run a backup:
   `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend python scripts/backup.py`
2. `git pull`
3. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml build`
4. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml run --rm backend alembic upgrade head`
5. `docker compose --env-file .env.vps -f docker-compose.yml -f docker-compose.prod.yml up -d`
6. Check `https://$APP_DOMAIN/health/ready`
7. Run the smoke test checklist below.

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

## Host Hardening Verification

- `ufw status`
- `fail2ban-client status`
- `ss -tulpn | rg ':80|:443|:3400|:8000'`

Expected result:

- shared host Caddy binds public `80/443`
- Re7 frontend binds loopback only on `127.0.0.1:${FRONTEND_PUBLIC_PORT:-3400}`
- Re7 backend is not exposed on the host

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

- host Caddy logs for the Re7 vhost
- `docker compose ... logs frontend`
- `docker compose ... logs backend`
- confirm `alembic upgrade head` ran before restart
- confirm the uploads volume is mounted and writable
- confirm the SQLite file exists at the configured `DATABASE_URL`
