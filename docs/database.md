Database setup (MySQL)

This project can run using static JSON data (default) or connect to a MySQL database.

1) Enable database usage
- Copy `.env.local.example` to `.env.local` (this file should NOT be committed).
- Fill the values with your database credentials:

```
USE_DB=true
DB_HOST=100.99.43.78
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=raquibiPortfolio
```

2) What the code does
- `src/lib/db.js` creates a MySQL connection pool using the above env vars.
- `src/lib/blogUtils.ts` will use the DB if `USE_DB=true` and fallback to `src/data/blogs.json` otherwise.
- API endpoints under `src/app/api/blogs` were adapted to call the async DB-backed methods.

3) Notes & security
- Never commit `.env.local` to source control. Use `.env.local.example` for placeholders.
- If your DB server restricts access by IP, ensure the machine running this app can reach `100.99.43.78:3306`.

4) Troubleshooting
- If you get connection errors, set `USE_DB=false` to fallback to static data and verify the DB is reachable from your host (telnet/curl or mysql client).

