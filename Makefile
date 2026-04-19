SHELL := /bin/bash

.DEFAULT_GOAL := help

GIT_SHA ?= $(shell git rev-parse --short HEAD)
DOCKER_COMPOSE ?= docker compose

FRONTEND_DIR := frontend
BACKEND_DIR := backend

LOCAL_ENV_FILE ?= .env.localhost
TAILSCALE_ENV_FILE ?= .env.tailscale
PROD_ENV_FILE ?= .env.vps
APP_DOMAIN ?= $(shell sed -n 's/^APP_DOMAIN=//p' $(PROD_ENV_FILE) 2>/dev/null | tail -n 1)
SERVICE ?=

LOCAL_COMPOSE = $(DOCKER_COMPOSE) --env-file $(LOCAL_ENV_FILE) -f docker-compose.yml
TAILSCALE_COMPOSE = $(DOCKER_COMPOSE) --env-file $(TAILSCALE_ENV_FILE) -f docker-compose.yml
PROD_COMPOSE = $(DOCKER_COMPOSE) --env-file $(PROD_ENV_FILE) -f docker-compose.yml -f docker-compose.prod.yml

.PHONY: help frontend-fmt frontend-lint frontend-typecheck frontend-test backend-test test check \
	local-up tailscale-up prod-backup prod-build prod-migrate prod-seed prod-create-admin prod-up \
	prod-deploy prod-ps prod-logs prod-health prod-health-local prod-version

help:
	@printf '%s\n' \
		'Common targets:' \
		'  make check            Run backend tests plus required frontend checks' \
		'  make test             Run backend and frontend tests' \
		'  make local-up         Start the localhost stack with Docker Compose' \
		'  make tailscale-up     Start the tailscale stack with Docker Compose' \
		'  make prod-deploy      Backup, rebuild, migrate, recreate, and verify production' \
		'  make prod-version     Show the running backend/frontend Git SHA'

frontend-fmt:
	cd $(FRONTEND_DIR) && bun fmt

frontend-lint:
	cd $(FRONTEND_DIR) && bun lint

frontend-typecheck:
	cd $(FRONTEND_DIR) && bun typecheck

frontend-test:
	cd $(FRONTEND_DIR) && bun test

backend-test:
	cd $(BACKEND_DIR) && pytest -q

test: backend-test frontend-test

check: backend-test frontend-fmt frontend-lint frontend-typecheck

local-up:
	GIT_SHA=$(GIT_SHA) $(LOCAL_COMPOSE) up --build

tailscale-up:
	GIT_SHA=$(GIT_SHA) $(TAILSCALE_COMPOSE) up --build

prod-backup:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	$(PROD_COMPOSE) run --rm backend python scripts/backup.py

prod-build:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	GIT_SHA=$(GIT_SHA) $(PROD_COMPOSE) build --pull backend frontend

prod-migrate:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	GIT_SHA=$(GIT_SHA) $(PROD_COMPOSE) run --rm backend --migrate

prod-seed:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	GIT_SHA=$(GIT_SHA) $(PROD_COMPOSE) run --rm backend --migrate --seed

prod-create-admin:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	GIT_SHA=$(GIT_SHA) $(PROD_COMPOSE) run --rm backend --create-admin

prod-up:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	GIT_SHA=$(GIT_SHA) $(PROD_COMPOSE) up -d --force-recreate --remove-orphans

prod-deploy: prod-backup prod-build prod-migrate prod-up prod-health prod-version

prod-ps:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	$(PROD_COMPOSE) ps

prod-logs:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	$(PROD_COMPOSE) logs --tail=200 $(SERVICE)

prod-health:
	@test -n "$(APP_DOMAIN)" || (echo "APP_DOMAIN is not set in $(PROD_ENV_FILE)" >&2; exit 1)
	curl -fsS https://$(APP_DOMAIN)/health/ready

prod-health-local:
	@test -n "$(APP_DOMAIN)" || (echo "APP_DOMAIN is not set in $(PROD_ENV_FILE)" >&2; exit 1)
	curl -fsS -H 'Host: $(APP_DOMAIN)' http://re7.internal/health/ready

prod-version:
	@test -f $(PROD_ENV_FILE) || (echo "Missing $(PROD_ENV_FILE)" >&2; exit 1)
	@printf 'backend git sha: '
	@$(PROD_COMPOSE) exec backend sh -lc 'printf "%s\n" "$$APP_GIT_SHA"'
	@printf 'frontend git sha: '
	@$(PROD_COMPOSE) exec frontend sh -lc 'printf "%s\n" "$$APP_GIT_SHA"'
