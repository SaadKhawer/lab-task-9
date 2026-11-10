# CS-301L Lab 09 — Security, Middleware, Guards and Pipes

Full Stack Web Development Lab (NestJS) — Air University Islamabad.

## Tasks (20 marks)

| Task | Topic | Marks |
| --- | --- | --- |
| 1 | Secure application bootstrap (Helmet, CORS, global ValidationPipe) | 3 |
| 2 | DTO validation + PATCH /notes/:id with tags | 4 |
| 3 | Custom middleware: Request ID | 3 |
| 4 | Custom pipe: SortOrderPipe | 3 |
| 5 | Authentication: change password | 4 |
| 6 | Authorization: admin users list + ownership | 3 |

## Layout

```
lab09/          # NestJS project (users, auth, notes modules)
  src/
  screenshots/  # Postman evidence, task1.png, task2.png, ...
  README.md     # reflection answers
```

## Run

```bash
cd lab09
npm install
npm run start:dev
```

Tests: every endpoint verified in Postman — see `lab09/screenshots/`.
