# Copilot Instructions — FullStack-Course

## Quick summary

- Monorepo with two main apps:
    - `server/` — Express + Sequelize (MySQL). Runs on port 3000. Key files: `index.js`, `routes/*.js`, `models/*.js`, `middlewares/AuthMiddleware.js`, `config/config.json`.
    - `client/` — React + Vite. Talks to the backend at `http://localhost:3000` via Axios. Key files: `src/pages/*.jsx`.

## How to run (developer workflow) ✅

- Install deps: `cd server && npm install`, `cd client && npm install`.
- Ensure MySQL is running and a database exists that matches `server/config/config.json.development.database` (default: `newdb`).
- Start backend: `cd server && npm start` (uses `nodemon index.js` and runs `db.sequelize.sync()` on boot).
- Start frontend: `cd client && npm run dev` (Vite dev server).

> Note: Sequelize uses `sequelize.sync()` in `server/index.js` — models/tables are created at startup only if the DB exists.

## Architecture & data flow 💡

- Client requests:
    - `GET /posts` -> list all posts (`server/routes/Posts.js`).
    - `GET /posts/byId/:id` -> single post.
    - `GET /comments/:postId` -> comments for a post (`server/routes/Comments.js`).
    - `POST /auth/login` -> returns a raw JWT string (not an object).
    - `POST /comments` -> requires header `accessToken` with the JWT.
- Auth: JWT signed using the literal secret `importantsecret` (see `server/routes/Users.js` and `server/middlewares/AuthMiddleware.js`). Frontend stores the token via `sessionStorage.setItem("accessToken", response.data)` and sends it in header `accessToken` on protected calls.
- DB relationships: `Posts.hasMany(Comments)` with `onDelete: 'cascade'`; `Comments.belongsTo(Posts)` (see `server/models/*.js`). `Users` associations are present but commented out.

## Patterns & conventions to follow 🔧

- Route design: route modules export a Router and are mounted in `server/index.js` (`/posts`, `/comments`, `/auth`). Follow the same route naming and parameter style (e.g., `/comments/:postId`).
- Error / response style: current routes mostly return `res.json(...)`; some endpoints use `res.status(...)` + json. Match the minimal response shape the frontend expects (e.g., `/auth/login` returns a raw token string).
- Auth checks: protected endpoints call `validateToken` middleware which reads `req.header('accessToken')` and verifies with `jsonwebtoken`. Use the same header name when adding new protected endpoints.
- Create endpoints to match the frontend payloads exactly — for example, `POST /comments` expects `{ commentBody, PostId }`.

## Safety & maintenance notes ⚠️

- Secrets and DB credentials are hard-coded (`importantsecret`, `config/config.json`). Prefer moving these to environment variables when modifying code.
- `sequelize.sync()` is used rather than migrations. If you add schema changes, update carefully — the project does not use migration scripts here.

## Quick examples (for testing / PRs)

- Login (raw token):
  curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"u","password":"p"}'

- Add a comment with token header:
  curl -s -X POST http://localhost:3000/comments -H "accessToken: <TOKEN>" -H "Content-Type: application/json" -d '{"commentBody":"hi","PostId":1}'

## Files to check when working on features/bugs 🔎

- Server: `index.js`, `routes/Posts.js`, `routes/Comments.js`, `routes/Users.js`, `middlewares/AuthMiddleware.js`, `models/*.js`, `config/config.json`.
- Client: `src/pages/*` (see `CreatePost.jsx`, `Post.jsx`, `Login.jsx`, `home.jsx`) for how payloads and tokens are used.

---

If anything is unclear or you want me to add short example PR templates / tests to this file, tell me which areas you'd like expanded.
