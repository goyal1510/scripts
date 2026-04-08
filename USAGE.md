# Usage Guide

## Scripts

### `scripts/personal/users/`

#### List Users

Lists all auth users with their `jg_account.profiles` data. Flags users with missing profiles.

```bash
node scripts/personal/users/list-users/index.js
```

No flags required.

---

#### Create New User

Creates an auth user and a profile in `jg_account.profiles`.

```bash
node scripts/personal/users/new/index.js -e=<email> -p=<password> -fn=<first-name> -ln=<last-name> -r=<role>
```

| Flag | Long | Required | Default | Description |
|---|---|---|---|---|
| `-e` | `--email` | Yes | — | User email |
| `-p` | `--password` | Yes | — | User password |
| `-fn` | `--first-name` | No | `""` | First name |
| `-ln` | `--last-name` | No | `""` | Last name |
| `-r` | `--role` | No | `user` | User role |

**Example:**

```bash
node scripts/personal/users/new/index.js -e=john@example.com -p=SecurePass123 -fn=John -ln=Doe
```

---

#### Update User

Updates auth fields (email, password) and/or profile fields. Identify the user by UUID or email.

```bash
node scripts/personal/users/update/index.js -id=<uuid> | -le=<email> -e=<new-email> -p=<new-password> -fn=<first-name> -ln=<last-name> -r=<role> -av=<avatar-url>
```

| Flag | Long | Required | Description |
|---|---|---|---|
| `-id` | `--user-id` | One of `-id` or `-le` | User UUID |
| `-le` | `--lookup-email` | One of `-id` or `-le` | Find user by email |
| `-e` | `--email` | No | New email |
| `-p` | `--password` | No | New password |
| `-fn` | `--first-name` | No | Update first name |
| `-ln` | `--last-name` | No | Update last name |
| `-r` | `--role` | No | Update role |
| `-av` | `--avatar-url` | No | Update avatar URL |

**Examples:**

```bash
# Update password by email lookup
node scripts/personal/users/update/index.js -le=john@example.com -p=NewPass123

# Update name by user ID
node scripts/personal/users/update/index.js -id=abc-123-uuid -fn=Jane -ln=Smith
```

---

### `scripts/personal/bank/sbi/`

#### Merge Monthly Statements

Merges 12 monthly SBI Excel statements (April–March) into a single FY file.

Place your monthly `.xlsx` files in `scripts/personal/bank/sbi/monthly/`.

```bash
node scripts/personal/bank/sbi/merge.js
```

No flags required. Output: `scripts/personal/bank/sbi/monthly/SBI_FY_2025_26.xlsx`

---

## Logs

Each script creates a log file in its own `logs/` directory on every run:

```
scripts/personal/users/list-users/logs/20260331_143025_list-users.log
scripts/personal/users/new/logs/20260331_143025_new-user_john@example.com.log
scripts/personal/users/update/logs/20260331_143025_update-user_john@example.com.log
```

Logs are gitignored.

---

## Directory Structure

```
scripts/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── USAGE.md
├── lib/
│   ├── supabase-client.js      # Supabase JS client
│   ├── pg-client.js             # Direct Postgres client (pg Pool)
│   └── logger.js                # Shared logger (tees output to log files)
└── scripts/
    └── personal/
        ├── users/
        │   ├── list-users/
        │   │   └── index.js
        │   ├── new/
        │   │   └── index.js
        │   └── update/
        │       └── index.js
        └── bank/
            └── sbi/
                ├── merge.js
                └── monthly/       # place .xlsx files here
```
