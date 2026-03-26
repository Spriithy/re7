# Shared Caddy Snippet

Re7 production no longer runs its own public Caddy container.

Use the example snippet in [`re7.example.com.Caddyfile`](./re7.example.com.Caddyfile) inside your VPS-level shared Caddy configuration, then change:

- the hostname
- the upstream port if you changed `FRONTEND_PUBLIC_PORT` in `.env.vps`

In the supported production deployment model:

- shared host `cloudflared` receives public traffic from Cloudflare
- shared host Caddy receives the request locally from `cloudflared`
- Caddy matches the public hostname and proxies to the Re7 loopback frontend port
- Cloudflare, not Caddy, terminates public TLS

Re7 expects the shared Caddy instance on the host to:

- serve the public hostname locally behind the tunnel
- proxy all requests to the Re7 frontend loopback port

The frontend then proxies `/api`, `/uploads`, and `/health` to the backend container internally.

Operator note:

- shared host `cloudflared` should forward `re7.example.com` to `http://re7.internal`
- `re7.internal` must resolve locally to the shared host Caddy listener
