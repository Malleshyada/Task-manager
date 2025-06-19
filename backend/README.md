# Task Manager Backend

## Setup
1. Install dependencies: `npm install`
2. Install type definitions for cors: `npm install --save-dev @types/cors`
3. Copy `.env.example` to `.env` and configure.
4. Run the server: `npm run start`

## API Endpoints
- GET /tasks - List all tasks
- POST /tasks - Create a new task
- PUT /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task

## Environment Variables
- DATABASE_URL: SQLite database path (e.g., `sqlite:./database.sqlite`)
- PORT: Server port (default: 5000)