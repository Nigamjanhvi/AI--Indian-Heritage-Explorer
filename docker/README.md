# Docker

The root `docker-compose.yml` orchestrates:

- `backend`: Express API
- `frontend`: React build served by Nginx
- `nginx`: reverse proxy for `/api`, `/uploads` and the frontend

Run:

```bash
docker compose up --build -d
```
