# Running Mocha E2E Tests

## Prerequisites

Make sure you have these installed on your machine:
- **Node.js** v18+
- **Google Chrome** (latest version)

---

## Step 1 – Install dependencies

```bash
# From the project root
cd client
npm install
```

This installs everything including `mocha`, `chai`, and `selenium-webdriver`.

---

## Step 2 – Start the servers

Open **two separate terminals**:

**Terminal 1 – Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```

Wait until both say they are running (backend on port 5000, frontend on port 5173).

---

## Step 3 – Run the Mocha tests

Open a **third terminal**:

```bash
cd client
npm run test:mocha
```

Chrome will launch automatically, run all tests, then close itself.

---

## What to expect

| Result | Meaning |
|--------|---------|
| `✔ TC-N-XX ...` (green) | Normal test **PASSED** as expected ✅ |
| `✗ TC-B-XX ...` (red) | Bug test **FAILED** as expected ❌ — this is intentional! |

**Bug tests are designed to fail** — they expose known issues in the codebase. Once a developer fixes the bug, the test will automatically turn green.

---

## Test file location

```
client/
  tests/
    mocha_example.test.js   ← all 27 test cases
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ChromeDriver not found` | Install Chrome or update it to the latest version |
| `Connection refused` | Make sure both dev servers are running (Step 2) |
| `TimeoutError` | The page took too long — check that the frontend runs at `http://localhost:5173` |
