# Problem 5 - Resource CRUD API

A RESTful API for managing resources built with Express.js and TypeORM.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js 5.x
- **ORM:** TypeORM
- **Database:** SQLite

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DB_URL=database.sqlite
```

## How to Run

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Endpoints

Base URL: `http://localhost:3000`

### Health Check

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Check server status |

### Resources

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| POST   | `/api/resources`    | Create a new resource    |
| GET    | `/api/resources`    | Get all resources        |
| GET    | `/api/resources/:id`| Get a resource by ID     |
| PUT    | `/api/resources/:id`| Update a resource by ID  |
| DELETE | `/api/resources/:id`| Delete a resource by ID  |

### Request/Response Examples

#### Create Resource

```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Sample Resource"}'
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Sample Resource",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Resources

```bash
curl http://localhost:3000/api/resources
```

#### Get Resource by ID

```bash
curl http://localhost:3000/api/resources/1
```

#### Update Resource

```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Resource"}'
```

#### Delete Resource

```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

## Scripts

| Script        | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Run in development mode with hot reload |
| `npm run build` | Compile TypeScript to JavaScript   |
| `npm start`   | Run compiled JavaScript             |
| `npm run lint`| Run ESLint                          |
