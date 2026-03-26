FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml ./
COPY app ./app

RUN pip install --no-cache-dir .

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "if [ \"$ENVIRONMENT\" = \"production\" ]; then exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-8000}; fi; exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-8000} --reload"]
