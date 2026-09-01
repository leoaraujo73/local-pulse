# Base44 Development Notes

- The project is a static PWA; no build, database, migrations, or external credentials are required.
- Start it with `docker compose -f docker-compose.base44.yml up -d`.
- Verify the app with `curl -fsS http://localhost:3000/` and the news feed with `curl -fsS http://localhost:3000/noticias.json`.
- The source directory is bind-mounted into the server container, so file changes are served directly without rebuilding the image.
