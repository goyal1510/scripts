# Scripts

Node.js (ESM) + Supabase scripts repo.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your .env values
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `DATABASE_URL` | Direct Postgres connection string |

## Usage

Import the clients from `lib/` in your scripts:

```js
import { query, end } from "./lib/pg-client.js";       // direct Postgres
import { supabase } from "./lib/supabase-client.js";    // Supabase JS client
```

## Structure

- `lib/supabase-client.js` — Supabase JS client
- `lib/pg-client.js` — Direct Postgres client (pg Pool)
