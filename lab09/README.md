# Lab 09 — Security, Middleware, Guards and Pipes (CS-301L, 20 marks)

NestJS 10 API built on the Lab 09 manual project (users, auth, notes modules).
In-memory data stores (same style as Lab 08) — no database needed.

## Run it

```bash
cd lab09
npm install
npm run start:dev        # http://localhost:3000
```

Set `JWT_SECRET` in a local `.env` if you want (see `.env.example`); without
it the app uses a dev-only fallback secret, fine for a lab.

## Seed accounts (created on startup)

| Email | Password | Role | Notes |
| --- | --- | --- | --- |
| `admin@lab09.dev` | `Admin1234` | admin | For Task 6 |
| `ali@lab09.dev` | `Ali12345` | user | Owns "Apple notes", "Mango notes", "Zebra notes" (Task 4 sorting demo) |
| `sara@lab09.dev` | `Sara12345` | user | Owns "Sara first note" (Task 2 403 test) |

Registering is open (`POST /auth/register`) — new users always get role `user`.

## What was built (one file per task)

| Task | Marks | Where | What |
| --- | --- | --- | --- |
| 1 Secure bootstrap | 3 | `src/main.ts` | Helmet, CORS restricted to `http://localhost:5173`, global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) |
| 2 DTOs + PATCH | 4 | `src/notes/dto/create-note.dto.ts`, `update-note.dto.ts`, `src/common/pipes/positive-int.pipe.ts`, `src/notes/notes.service.ts` | `tags` rules (max 5, max 20 chars each), `UpdateNoteDto = PartialType(CreateNoteDto)`, `PositiveIntPipe` for `:id`, owner-or-admin only update (403) |
| 3 Middleware | 3 | `src/common/middleware/request-id.middleware.ts`, `logger.middleware.ts`, `src/app.module.ts` | `randomUUID()` request id in `X-Request-Id` header, log format `[id] GET /notes -> 200 (4ms)`, request-id registered before logger |
| 4 SortOrderPipe | 3 | `src/common/pipes/sort-order.pipe.ts`, `src/notes/notes.controller.ts` | `?order=` asc/desc (case-insensitive), missing = asc, anything else = 400 `"order must be asc or desc"` |
| 5 Change password | 4 | `src/auth/dto/change-password.dto.ts`, `src/auth/auth.service.ts`, `src/users/users.service.ts` | `POST /auth/change-password` behind `AuthGuard`, bcrypt compare, new != current, hash + save via `UsersService.updatePassword()` |
| 6 Admin users list | 3 | `src/users/users.controller.ts`, `src/common/decorators/roles.decorator.ts`, `src/common/guards/roles.guard.ts` | `GET /users` with `@UseGuards(AuthGuard, RolesGuard)` + `@Roles('admin')`, returns only id/name/email/role |

## Test results (all green)

- Direct endpoint suite (36 checks, one per expected result in the task sheet): **36/36 passed**
- Postman collection `postman/Lab09_Tasks.postman_collection.json` via Newman: **25 requests, 32 assertions, 0 failed**
- Screenshots of the live responses: `screenshots/task1.png` … `screenshots/task6.png` (+ `newman-summary.png`)

Note: NestJS returns 201 for a POST by default, so `POST /auth/login` and
`POST /auth/change-password` use `@HttpCode(200)` to return the 200 the
task sheet asks for. Register stays 201 (a new user is created).

## Reflection questions

**1. What is the difference between 401 and 403? Give one example of each from this project.**
401 means "who are you?" — the request has no valid login. 403 means "I know who you are, but you may not do this." In this project, `GET /notes` without a token returns 401, while `PATCH /notes/:id` by a logged-in user who does not own the note returns 403.

**2. Why is server-side validation still needed if the frontend already validates?**
Because the frontend cannot be trusted — anyone can call the API directly with curl or Postman and skip the form entirely. In this lab, `POST /notes` with 6 tags is rejected by the server with 400 even though no form was involved, so bad data can never reach the data store.

**3. A JWT payload can be read by anyone — why is it still safe to use?**
The payload is only base64-encoded, not encrypted, so anyone can read it — but nobody can change it, because the server signs it with a secret key. If a user edits their role to "admin" in the token, the signature no longer matches and `AuthGuard` rejects it with 401.

**4. Why does login return the same error for an unknown email and a wrong password?**
To avoid leaking information: if the two errors differed, an attacker could probe email addresses and learn which accounts exist. Returning "Invalid email or password" for both cases keeps account existence private.

**5. In what order do middleware, guards and pipes run? Why must AuthGuard run before RolesGuard?**
Middleware runs first, then guards, then pipes (and the ValidationPipe runs before the controller). RolesGuard must run after AuthGuard because it reads `req.user.role` — and `req.user` only exists once AuthGuard has verified the token and attached the user. If RolesGuard ran first it would see no user and wrongly deny everyone.
