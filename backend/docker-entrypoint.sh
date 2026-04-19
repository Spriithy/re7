#!/bin/sh
set -eu

app_root="${APP_ROOT:-/app}"

default_backend_command() {
    if [ "${ENVIRONMENT:-development}" = "production" ]; then
        printf '%s\n' uvicorn app.main:app --host 0.0.0.0 --port "${BACKEND_PORT:-8000}"
        return
    fi

    printf '%s\n' uvicorn app.main:app --host 0.0.0.0 --port "${BACKEND_PORT:-8000}" --reload
}

fix_permissions() {
    path="$1"

    mkdir -p "$path"

    if [ "$(id -u)" -eq 0 ]; then
        chown -R app:app "$path"
    fi
}

fix_permissions "$app_root/data"
fix_permissions "$app_root/uploads"
fix_permissions "$app_root/backups"

run_as_app() {
    if [ "$(id -u)" -eq 0 ]; then
        su -s /bin/sh app -c "$*"
        return
    fi

    sh -c "$*"
}

run_migrations=false
run_seed=false
run_create_admin=false
ran_one_off_task=false

while [ "$#" -gt 0 ]; do
    case "$1" in
        --migrate)
            run_migrations=true
            shift
            ;;
        --seed)
            run_seed=true
            shift
            ;;
        --create-admin)
            run_create_admin=true
            shift
            ;;
        --help)
            cat <<'EOF'
Usage: docker-entrypoint.sh [--migrate] [--seed] [--create-admin] [command...]

Flags:
  --migrate       Run `alembic upgrade head` before starting the backend.
  --seed          Seed default categories before starting the backend.
  --create-admin  Create the admin account before starting the backend.

Admin creation:
  Interactive: attach a TTY and pass `--create-admin`.
  Non-interactive: set ADMIN_USERNAME and ADMIN_PASSWORD.
EOF
            exit 0
            ;;
        --)
            shift
            break
            ;;
        -*)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

if [ "$run_migrations" = true ]; then
    run_as_app "cd $app_root && alembic upgrade head"
    ran_one_off_task=true
fi

if [ "$run_seed" = true ]; then
    run_as_app "cd $app_root && python scripts/seed_default_categories.py"
    ran_one_off_task=true
fi

if [ "$run_create_admin" = true ]; then
    admin_command="cd $app_root && python scripts/create_admin.py"

    if [ -n "${ADMIN_USERNAME:-}" ] || [ -n "${ADMIN_PASSWORD:-}" ]; then
        admin_command="$admin_command --non-interactive"
    fi

    run_as_app "$admin_command"
    ran_one_off_task=true
fi

if [ "$#" -eq 0 ] && [ "$ran_one_off_task" = true ]; then
    exit 0
fi

if [ "$#" -eq 0 ]; then
    set -- $(default_backend_command)
fi

if [ "$(id -u)" -eq 0 ]; then
    exec su -s /bin/sh app -c 'exec "$@"' -- sh "$@"
fi

exec "$@"
