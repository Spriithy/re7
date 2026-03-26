FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HOME=/home/app

WORKDIR /app

COPY pyproject.toml ./
COPY app ./app

RUN pip install --no-cache-dir .

COPY . .

RUN groupadd --gid 10001 app \
    && useradd --uid 10001 --gid app --create-home --home-dir /home/app app \
    && mkdir -p /app/data /app/uploads /app/backups \
    && chown -R app:app /app /home/app \
    && chmod +x /app/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-8000}; fi; exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-8000} --reload"]
