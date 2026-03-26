# Shared Caddy Snippet

Re7 production no longer runs its own public Caddy container.

Use the example snippet in [`re7.example.com.Caddyfile`](./re7.example.com.Caddyfile) inside your VPS-level shared Caddy configuration, then change:

- the hostname
- the upstream port if you changed `FRONTEND_PUBLIC_PORT` in `.env.vps`

Re7 expects the shared Caddy instance on the host to:

- terminate TLS
- serve the public hostname
- proxy all requests to the Re7 frontend loopback port

The frontend then proxies `/api`, `/uploads`, and `/health` to the backend container internally.
