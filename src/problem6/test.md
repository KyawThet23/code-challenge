# Live Score Board Service

## Purpose

This service manages user scores and provides real-time leaderboard updates.

Features:
- Secure score updates
- Real-time top 10 leaderboard
- Anti-cheat and authorization validation
- WebSocket-based live updates

---

# High Level Architecture

Frontend Client
    |
    | HTTPS REST API
    v
Application Server
    |
    | Publish Event
    v
Event Queue / Internal Event Bus
    |
    v
Score Service
    |
    +--> Database
    |
    +--> WebSocket Gateway
             |
             v
        Connected Clients

---

# Functional Requirements

## 1. Leaderboard

- Display top 10 users sorted by score descending
- Must support live updates
- Ties should be resolved by earliest achievement timestamp

---

## 2. Score Update

A user performs an action in the system.

The frontend sends a request to:

POST /api/v1/scores/actions/complete

The backend validates:
- Authentication token
- Action legitimacy
- Duplicate requests
- Rate limits

If valid:
- User score is updated
- Leaderboard recalculated
- Update broadcast to all connected clients

---

# API Specification

## POST /api/v1/scores/actions/complete

### Headers

Authorization: Bearer <JWT_TOKEN>

### Request Body

```json
{
  "actionId": "mission-001",
  "completionId": "uuid",
  "timestamp": 1710000000
}
```

### Response

Success:

```json
{
  "success": true,
  "newScore": 1500,
  "rank": 4
}
```

Failure:

```json
{
  "success": false,
  "errorCode": "INVALID_ACTION"
}
```

---

## GET /api/v1/leaderboard

Returns top 10 users.

### Response

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "u100",
      "displayName": "Alice",
      "score": 5000
    }
  ]
}
```

---

# WebSocket API

## Connection

wss://api.example.com/ws/leaderboard

---

## Event: leaderboard.updated

```json
{
  "type": "leaderboard.updated",
  "timestamp": 1710000000,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "u100",
      "displayName": "Alice",
      "score": 5000
    }
  ]
}
```

Clients should subscribe after connection.

---

# Security Requirements

## Authentication

- All score update APIs require JWT authentication
- Tokens must be validated server-side

---

## Authorization

Backend must independently verify:
- User completed valid action
- Action reward is allowed
- Action has not already been redeemed

Frontend validation alone is NOT trusted.

---

## Anti-Cheat Protection

### Required Protections

1. Idempotency
- completionId must be unique
- Prevent replay attacks

2. Rate Limiting
- Limit action completion frequency

3. Server-Side Score Calculation
- Client cannot submit arbitrary score values

BAD:

```json
{
  "score": 999999
}
```

GOOD:

```json
{
  "actionId": "mission-001"
}
```

4. Audit Logging
- Record all score updates
- Store:
  - userId
  - actionId
  - IP
  - timestamp
  - user agent

5. Replay Protection
- Expire old completion requests

6. Suspicious Activity Detection
- Detect impossible scoring frequency
- Trigger moderation or temporary bans

---

# Data Model

## User

| Field | Type |
|---|---|
| id | UUID |
| display_name | VARCHAR |
| created_at | TIMESTAMP |

---

## Score

| Field | Type |
|---|---|
| user_id | UUID |
| total_score | BIGINT |
| updated_at | TIMESTAMP |

---

## ScoreTransaction

| Field | Type |
|---|---|
| id | UUID |
| user_id | UUID |
| action_id | VARCHAR |
| points | INT |
| completion_id | UUID |
| created_at | TIMESTAMP |

---

# Recommended Technologies

## Backend
- Node.js
- Spring Boot
- Go
- .NET

## Real-Time Communication
- WebSocket
- Socket.IO
- SSE (fallback)

## Database
- PostgreSQL
- Redis (leaderboard cache)

---

# Performance Requirements

## Latency

- Score update API < 300ms
- WebSocket broadcast < 1 second

---

## Scalability

The service should support:
- 100k concurrent websocket clients
- Horizontal scaling
- Distributed event broadcasting

---

# Suggested Flow

1. User completes action
2. Frontend calls backend API
3. Backend authenticates request
4. Backend validates action
5. Backend writes score transaction
6. Backend updates total score
7. Backend updates leaderboard cache
8. Backend publishes leaderboard update event
9. WebSocket gateway broadcasts update
10. Clients refresh UI

---

# Failure Handling

## Duplicate Request

Return:

```json
{
  "success": false,
  "errorCode": "DUPLICATE_COMPLETION"
}
```

---

## Unauthorized Request

HTTP 401

---

## Invalid Action

HTTP 400

---

# Deployment Considerations

- Use Redis pub/sub for distributed websocket servers
- Use DB transactions for score updates
- Use optimistic locking or atomic increment operations
- Enable structured logging and monitoring
