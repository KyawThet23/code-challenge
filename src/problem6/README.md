# Problem 6 — Live Scoreboard Module

## Overview

**The module responsible for ingesting live score of the top 10 users. Respective score point datas will be updated by users, the service needs to authenticate their action. The goal is to show the top 10 leaderboard in real-time.**

## API routes

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg"><thead>
  <tr>
    <th class="tg-0pky"> POST /score/update </th>
    <th class="tg-0pky"> Update the score after user action completed </th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-0pky"> GET /score </td>
    <td class="tg-0pky"> Get the top 10 leaderboard data </td>
  </tr>
</tbody>
</table>

## Authorization

- **All score update APIs require JWT authentication**
- **Tokens must be validated server-side**

## Real Time distribution

- **[Web socket](https://socket.io/) layer used for update message publish via bus server to connected client.**

## Data Store

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>
<table class="tg"><thead>
  <tr>
    <th class="tg-0pky">Redis</th>
    <th class="tg-0pky">Redis provides low-latency real-time operations</th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-0pky">DB store</td>
    <td class="tg-0pky">The database is used for persistence.</td>
  </tr>
</tbody>
</table>

## Loggin, monitoring and auditing
- The module will automatically add unique ID to every request as header for tracing
- need to emit metrics like rate of authentication faliures etc.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant API as Scoreboard API
    participant Auth as Auth Service
    participant DB as SQL DB
    participant Cache as Redis Cache
    participant Bus as Message Broker
    participant WS as WebSocket Gateway

    Client->>API: POST /scores/increment (userId, delta, actionToken)
    API->>Auth: Validate actionToken + nonce
    Auth-->>API: Token valid (user scope, nonce)
    API->>DB: Atomic increment user_scores via stored procedure
    DB-->>API: Updated score & rank
    API->>Cache: Update cached top-10 (if affected)
    API->>Bus: Publish scoreboard.updates event
    Bus-->>WS: Forward event to connected clients
    WS-->>Client: Push updated scoreboard payload
    Client->>API: GET /scores/top (fallback polling)
    API->>Cache: Fetch leaderboard snapshot
    Cache-->>API: Cached top-10 data
    API-->>Client: Respond with leaderboard
```
