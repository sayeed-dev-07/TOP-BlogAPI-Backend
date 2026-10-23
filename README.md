# TOP Blog API — Backend

A REST API for a blog application, built with Express, PostgreSQL, Prisma, and JWT authentication. It supports user registration and login, admin-managed posts, and authenticated comments.

> This document describes the API **as it is implemented today**. All request bodies are JSON unless stated otherwise.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Authentication and access control](#authentication-and-access-control)
- [Data model](#data-model)
- [API reference](#api-reference)
- [Response and error conventions](#response-and-error-conventions)
- [Project structure](#project-structure)
- [Available scripts](#available-scripts)
- [Current API behaviour to know](#current-api-behaviour-to-know)

## Features

- Username/password registration with bcrypt password hashing
- JWT login tokens with a two-day lifetime
- Public post and comment reads
- Admin-only post creation, editing, deletion, publishing, and unpublishing
- Authenticated comment creation, with ownership checks for editing and deletion
- PostgreSQL persistence through Prisma ORM
- Cascading deletion of a post's comments

## Technology

- Node.js with ES modules
- Express 5
- PostgreSQL
- Prisma 7 and `@prisma/adapter-pg`
- JSON Web Tokens (`jsonwebtoken`)
- bcryptjs
- CORS middleware

## Quick start

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- PostgreSQL database
- npm

### Installation

```bash
git clone https://github.com/sayeed-dev-07/TOP-BlogAPI-Backend.git
cd TOP-BlogAPI-Backend
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
```

Apply the committed database migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npm run build
```

Start the API:

```bash
npm run dev
```

The local server listens at `http://localhost:3000` by default. The root endpoint can be used as a lightweight health check:

```json
GET /
{ "message": "Hello From the main page" }
```

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. Use a long, private random value. |
| `PORT` | No | HTTP port; defaults to `3000`. |
| `NODE_ENV` | No | When set to `production`, this module exports the Express app without calling `listen()`, so a hosting platform must start it through an appropriate entry point. |

Never commit `.env`; it is excluded by `.gitignore`.

## Authentication and access control

Register and then log in to receive a token. Send it on protected requests:

```http
Authorization: Bearer <token>
```

| Access level | Permissions |
| --- | --- |
| Public | Read all posts, a single post, and a post's comments. |
| Authenticated user | Public permissions plus create comments and update/delete their own comments. |
| Admin (`admin: true`) | Authenticated permissions plus all post-management endpoints. |

The `admin` flag comes from the signed login token. Registration creates non-admin users by default; administrator status must be set directly in the database or by an administrative provisioning process.

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Auto-incremented primary key. |
| `username` | string | Unique. |
| `password` | string | bcrypt hash; never returned by API endpoints. |
| `admin` | boolean | Defaults to `false`. |
| `createdAt` | ISO date-time | Set by the database. |

### Post

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Auto-incremented primary key. |
| `title` | string | Required at creation. |
| `content` | string | Required at creation. |
| `imgLink` | string | Required at creation. |
| `authorId` | integer | Taken from the authenticated admin's token. |
| `published` | boolean | Defaults to `false`. |
| `createdAt` | ISO date-time | Set by the database. |
| `updatedAt` | ISO date-time | Updated automatically by Prisma on post changes. |

### Comment

| Field | Type | Notes |
| --- | --- | --- |
| `id` | integer | Auto-incremented primary key. |
| `content` | string | Comment text. |
| `postId` | integer | Parent post ID. |
| `authorId` | integer | Taken from the authenticated user's token. |
| `createdAt` | ISO date-time | Set by the database. |

Deleting a post deletes its comments at the database level.

## API reference

Base URL: `http://localhost:3000`

### General routes

| Method | Path | Access | Success response |
| --- | --- | --- | --- |
| `GET` | `/` | Public | `200 { "message": "Hello From the main page" }` |
| `GET` | `/register` | Public | `200 { "message": "hello from register page" }` |
| `GET` | `/login` | Public | `200 { "message": "hello from login page" }` |

### Auth routes

#### `POST /register`

Creates a standard (non-admin) user. Passwords are hashed with bcrypt using 12 salt rounds.

Request body:

```json
{
  "username": "jane",
  "password": "a-strong-password"
}
```

Success (`201`):

```json
{ "message": "User registered successfully" }
```

Known responses: `409 { "message": "User already exists" }`; unexpected registration errors return `500 { "error": "Internal server error" }`.

#### `POST /login`

Request body:

```json
{
  "username": "jane",
  "password": "a-strong-password"
}
```

Success (`200`):

```json
{
  "message": "successfully logged in",
  "token": "<jwt>"
}
```

The token expires in two days and contains the user's `id`, `username`, and `admin` status. Invalid credentials return `401` with:

```json
{ "message": "username or password incorrect!" }
```

### Post routes

#### `GET /posts`

Returns every post. No authentication is required, and the current implementation does not filter unpublished posts.

Success (`200`):

```json
{
  "posts": [
    {
      "id": 1,
      "title": "First post",
      "content": "Post body",
      "imgLink": "https://example.com/cover.jpg",
      "authorId": 1,
      "published": false,
      "createdAt": "2026-10-23T00:00:00.000Z",
      "updatedAt": "2026-10-23T00:00:00.000Z"
    }
  ]
}
```

#### `GET /posts/:postId`

Returns one post by numeric ID.

Success (`200`):

```json
{ "data": { "id": 1, "title": "First post", "content": "Post body", "imgLink": "https://example.com/cover.jpg", "authorId": 1, "published": false, "createdAt": "...", "updatedAt": "..." } }
```

Not found (`404`):

```json
{ "message": "no post found with id 999" }
```

#### `POST /posts`

Creates a post. Requires an authenticated admin.

Request body:

```json
{
  "title": "First post",
  "content": "Post body",
  "imgLink": "https://example.com/cover.jpg"
}
```

`authorId` and `published` are not accepted from the client. The author is the current user and a new post starts unpublished.

Success (`201`):

```json
{
  "message": "Post created successfully",
  "post": { "id": 1, "title": "First post", "content": "Post body", "imgLink": "https://example.com/cover.jpg", "authorId": 1, "published": false, "createdAt": "...", "updatedAt": "..." }
}
```

Missing `title`, `content`, or `imgLink` returns `400 { "message": "Title and content and img are required!" }`.

#### `PATCH /posts/:postId`

Updates one or more post fields. Requires an authenticated admin.

Request body (provide at least one field):

```json
{
  "title": "Revised title",
  "content": "Revised body",
  "imgLink": "https://example.com/revised-cover.jpg"
}
```

Success (`200`):

```json
{
  "message": "Post updated successfully",
  "post": { "id": 1, "title": "Revised title", "content": "Revised body", "imgLink": "https://example.com/revised-cover.jpg", "authorId": 1, "published": false, "createdAt": "...", "updatedAt": "..." }
}
```

With no supported fields, the API returns `400 { "message": "At least one field (title or content or imglink) is required" }`. An unknown post returns `404`.

#### `DELETE /posts/:postId`

Deletes a post and its comments. Requires an authenticated admin.

Success (`200`):

```json
{ "message": "Deleted post associated with id 1" }
```

#### `PATCH /posts/:postId/publish`

Sets `published` to `true`. Requires an authenticated admin.

Success (`200`):

```json
{ "message": "Post published successfully" }
```

#### `PATCH /posts/:postId/unpublish`

Sets `published` to `false`. Requires an authenticated admin.

Success (`200`):

```json
{ "message": "Post unpublished successfully" }
```

For the delete, publish, and unpublish routes, a missing post returns `404 { "message": "no post found with id <postId>" }`.

### Comment routes

#### `GET /posts/:postId/comments`

Returns all comments for a post. Public.

Success (`200`):

```json
{
  "data": [
    {
      "id": 1,
      "content": "Great post!",
      "postId": 1,
      "authorId": 2,
      "createdAt": "2026-10-23T00:00:00.000Z"
    }
  ]
}
```

If the post does not exist: `404 { "message": "no post found with id 999" }`.

#### `POST /posts/:postId/comments`

Creates a comment for a post. Requires authentication.

Request body:

```json
{ "content": "Great post!" }
```

Success (`201`):

```json
{ "message": "successfully added the comment" }
```

The comment author is always derived from the token. A nonexistent post returns `404`. This endpoint has no explicit `content` presence/type validation; invalid data reaches the database layer and follows the application's default unexpected-error handling.

#### `PATCH /posts/:postId/comments/:commentId`

Updates a comment's content. Requires authentication and ownership of the comment. The parent post ID in the URL is used for routing but is not otherwise checked against the comment.

Request body:

```json
{ "content": "Updated comment" }
```

Success (`200`):

```json
{ "message": "successfully edited the comment" }
```

Known error responses:

- `404 { "message": "no comment found with id <commentId>" }`
- `403 { "message": "you must provide 'content' field" }`
- `403 { "message": "You cannot modify another user's comment" }`

#### `DELETE /posts/:postId/comments/:commentId`

Deletes a comment. Requires authentication and ownership of the comment. The parent post ID is used for routing but is not otherwise checked against the comment.

Success (`200`):

```json
{ "message": "comment with id = 1 is deleted" }
```

Known error responses:

- `404 { "message": "no comment found with id <commentId>" }`
- `403 { "message": "You cannot delete another user's comment" }`

## Response and error conventions

Successful read routes use either `posts` or `data`; successful mutations return a `message`, and post create/update responses also contain `post`. JSON error shapes use `message` in most handlers, while unexpected register/login errors use `error`.

Protected routes can return these authentication errors:

| Status | Response | Meaning |
| --- | --- | --- |
| `401` | `{ "message": "Authentication token required" }` | Missing or malformed `Authorization` header. |
| `401` | `{ "message": "User no longer exists. Please log in again." }` | JWT refers to a deleted user. |
| `401` | `{ "message": "Token has expired" }` | JWT is older than two days. |
| `403` | `{ "message": "Invalid token" }` | Token cannot be verified. |
| `403` | `{ "message": "Admin access required" }` | Authenticated non-admin called an admin-only route. |

## Project structure

```text
app.js                  Express application and top-level routes
controllers/            HTTP request/response handlers
routes/                 Post and nested comment routers
middlewares/            JWT verification and admin access check
db/query.js             Prisma database operations
lib/prisma.js           Prisma/PostgreSQL client setup
prisma/schema.prisma    Database schema
prisma/migrations/      Versioned PostgreSQL migrations
```

Request flow:

```text
HTTP request → Express route → authentication/authorization middleware
             → controller → db/query.js → Prisma → PostgreSQL
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Run `node app.js`. |
| `npm run dev` | Run with Node's watch mode for local development. |
| `npm run build` | Generate the Prisma client. |
| `npm test` | Currently exits with an error; no automated test suite has been configured. |

Useful Prisma commands:

```bash
npx prisma migrate dev --name <migration-name>  # create/apply a development migration
npx prisma migrate deploy                       # apply committed migrations
npx prisma studio                               # inspect data in a browser
```

## Current API behaviour to know

- Post read endpoints expose both published and unpublished posts to everyone; publishing does not currently affect read visibility.
- Any admin can edit or delete any post. There is no post-author ownership check for administrative operations.
- Values are not schema-validated beyond the explicit presence checks described above. For example, URL formatting and string length are not enforced.
- `PATCH /posts/:postId` only persists truthy values, so it cannot currently set `title`, `content`, or `imgLink` to an empty string.
- No application-level global error middleware is registered. Unexpected errors outside the explicit controller handling use Express's default error behavior.
- CORS is enabled with the default `cors()` configuration, which permits requests from any origin.

## License

No license file is currently included. Add a license before distributing or accepting external contributions under defined terms.
