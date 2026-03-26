#!/bin/sh
set -eu

fix_permissions() {
    path="$1"

    mkdir -p "$path"

    if [ "$(id -u)" -eq 0 ]; then
        chown -R app:app "$path"
    fi
}

fix_permissions /app/data
fix_permissions /app/uploads
fix_permissions /app/backups

if [ "$(id -u)" -eq 0 ]; then
    exec su app -s /bin/sh -c 'exec "$@"' sh "$@"
fi

exec "$@"
