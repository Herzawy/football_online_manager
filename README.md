# Football Online Manager

REST API for a fantasy football manager game.

## Tech Stack
- Node.js (Express)
- MySQL
- Prisma ORM
- Docker

## Quick Start (Docker)
- Prerequisites: Install Docker Desktop and ensure it is running.
- Clone the repository, then run:
  ```bash
  docker-compose up --build
  ```
- The API runs at `http://localhost:3000` and MySQL at `localhost:3306`.
- Migrations run automatically on container start.

## Local Development (without Docker)
- Prerequisites:
  - Node.js 18+ and npm
  - MySQL 8 running locally with a user that can create `football_manager`
- Configure environment:
  - Create `.env` in project root with:
    ```
    DATABASE_URL="mysql://root:password@localhost:3306/football_manager"
    JWT_SECRET="supersecretkey"
    PORT=3000
    ```
- Install dependencies and set up Prisma:
  ```bash
  npm install
  npx prisma generate
  npx prisma migrate dev --name init
  ```
- Start the server:
  ```bash
  npm start
  ```
- API is available at `http://localhost:3000`.

## Using the API
- Register/Login
  - `POST /api/auth/login`
  - Body example:
    ```json
    { "email": "user@example.com", "password": "secret123" }
    ```
  - Response contains `token` for Authorization.
- Get My Team
  - `GET /api/teams/my-team`
  - Header: `Authorization: Bearer <token>`
- Put Player on Transfer List / Update Asking Price
  - `PUT /api/teams/players/:id`
  - Body example:
    ```json
    { "isOnTransferList": true, "askingPrice": 1000000 }
    ```
- List Transfer Players
  - `GET /api/transfers?teamName=Team&playerName=John&minPrice=100000&maxPrice=1000000`
- Buy Player
  - `POST /api/transfers/buy/:id`
  - Header: `Authorization: Bearer <token>`

## Postman Collection
- Import the ready-to-use collection:
  - Open Postman and click `Import`.
  - Choose `File` and select `postman/football_online_manager.postman_collection.json`.
  - Click `Import`.
- Set collection variables:
  - `baseUrl`: `http://localhost:3000` (or your host/port)
  - `token`: paste JWT from the Auth login response
  - `playerId`: a valid player id (e.g., `1`)
- Run the requests in order:
  - Auth → Login/Register
  - Teams → Get My Team
  - Teams → Update Player Transfer Status
  - Transfers → List
  - Transfers → Buy Player

## Notes
- Team creation runs in a background process after registration, so a new team may take a short time to appear.
- Teams must have 15–25 players; transfers enforce these constraints.

## Time Report

| Section | Time Spent |
|---------|------------|
| Project Structure & Config | 30 mins |
| Database Schema Design | 20 mins |
| Authentication Implementation | 30 mins |
| Team Creation Logic | 40 mins |
| Transfer Market Logic | 40 mins |
| Docker & Documentation | 20 mins |
| **Total** | **~3 hours** |
