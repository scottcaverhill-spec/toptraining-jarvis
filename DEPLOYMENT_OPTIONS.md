# Jarvis Deployment Options for toptrainingacademy.com

This project supports two paths:

1. **Version A - Recommended Hybrid:** Run Jarvis on Vercel and connect it to GoDaddy with `jarvis.toptrainingacademy.com` or an embed/redirect.
2. **Version B - Pure GoDaddy:** Run the app from GoDaddy cPanel Node.js if the hosting plan supports Node 20 and enough memory.

Use Version A for the full Jarvis experience. Use Version B only if you must keep everything inside GoDaddy.

---

## Version A - Recommended Hybrid: Vercel + GoDaddy

### Why this is best

Vercel is built for Next.js App Router, serverless API routes, streaming responses, longer AI requests, environment variables, and future RAG/agent features. GoDaddy shared hosting is excellent for the static academy page, but it is not ideal for live AI workloads.

This version keeps:

- Next.js 15 App Router
- Vercel AI SDK streaming
- OpenAI API routes
- Jarvis voice UI
- Agent creation and agent routing
- Future Mastra/OpenAI Agents SDK expansion
- Future PDF/RAG/vector search

### Recommended live URL

Use:

```text
https://jarvis.toptrainingacademy.com
```

Then keep the academy button/link pointing to:

```text
https://jarvis.toptrainingacademy.com
```

or keep `/jarvis` on GoDaddy as a redirect/embed page.

### Vercel setup

1. Create a GitHub repo for this folder, or upload/import it directly into Vercel.
2. In Vercel, create a new project from this Jarvis app.
3. Set the framework to **Next.js**.
4. Set environment variables:

```text
OPENAI_API_KEY=your_real_key
OPENAI_MODEL=gpt-5.4-mini
NEXT_PUBLIC_BASE_PATH=
AGENT_STORE_PATH=/tmp/agents.json
OPENAI_CREATE_ASSISTANTS=false
```

For serious production agent storage, replace `AGENT_STORE_PATH` with Supabase, Vercel Postgres, Neon, or another real database. `/tmp` is temporary in serverless environments.

5. Deploy.
6. Test the Vercel URL.

### GoDaddy DNS for subdomain

In GoDaddy DNS for `toptrainingacademy.com`:

1. Add a CNAME record.
2. Name/Host:

```text
jarvis
```

3. Value/Points to:

```text
cname.vercel-dns.com
```

4. In Vercel, add the domain:

```text
jarvis.toptrainingacademy.com
```

5. Wait for DNS to verify.

### GoDaddy `/jarvis` redirect option

Upload this file as:

```text
/public_html/jarvis/index.html
```

Source file:

```text
deploy/godaddy-jarvis-redirect.html
```

That makes:

```text
https://toptrainingacademy.com/jarvis
```

redirect to:

```text
https://jarvis.toptrainingacademy.com
```

### GoDaddy `/jarvis` iframe option

Upload this file as:

```text
/public_html/jarvis/index.html
```

Source file:

```text
deploy/godaddy-jarvis-embed.html
```

This keeps the user visually inside the GoDaddy site while the real Jarvis app runs on Vercel.

If voice/microphone behaves oddly inside the iframe, use the redirect version. Browsers can be picky about microphone permissions in embedded frames.

---

## Version B - Pure GoDaddy cPanel Node.js

Use this only if cPanel includes **Setup Node.js App** and lets you run Node 20+.

### What this version can do

Best case, if GoDaddy allows install/build:

- Next.js standalone server
- API routes
- Chat
- Agent list/create/delete
- Voice UI in browser
- Limited streaming depending on proxy behavior

Fallback case, if GoDaddy cannot install/build Next:

- `server.js` automatically serves a lightweight Jarvis page
- Calls OpenAI Responses API directly from Node
- Provides local sales-coach fallback answers if OpenAI is unavailable
- No full Next.js UI, no real Vercel AI SDK streaming, no full App Router behavior

### Required cPanel settings

In **Setup Node.js App**:

```text
Node.js version: 20.x or newer
Application mode: Production
Application root: toptraining-jarvis-next-20260522
Application URL: jarvis
Application startup file: server.js
```

Environment variables:

```text
OPENAI_API_KEY=your_real_key
OPENAI_MODEL=gpt-5.4-mini
NEXT_PUBLIC_BASE_PATH=/jarvis
AGENT_STORE_PATH=./data/agents.json
OPENAI_CREATE_ASSISTANTS=false
USE_STATIC_JARVIS=false
```

If the full build fails, set:

```text
USE_STATIC_JARVIS=true
```

### Build commands

If cPanel terminal works:

```bash
npm install
npm run build
npm start
```

If npm install/build does not work:

```bash
USE_STATIC_JARVIS=true npm start
```

The included `server.js` checks for:

```text
.next/standalone/server.js
```

If it exists, it starts the full Next standalone build. If it does not exist, it starts the safe fallback server.

### Optional .htaccess

Usually cPanel Passenger handles routing for Node apps. If GoDaddy support says Apache routing is needed, use:

```text
deploy/htaccess-godaddy-node.example
```

and adjust paths if your account root changes.

### GoDaddy limitations

Expect possible issues with:

- Streaming responses through Apache/Passenger
- Long OpenAI requests timing out
- Low memory during `next build`
- No persistent storage if the app restarts or deploys over local JSON
- Limited debugging visibility
- Node version differences
- File permissions for `data/agents.json`

That is why Version A is the right long-term approach.

---

## Recommended Decision

Use GoDaddy for:

- Main Academy static site
- Domain/DNS
- `/jarvis` redirect or embed shell

Use Vercel for:

- Jarvis AI app
- API routes
- Streaming
- Agent creation
- Future RAG and database-backed training intelligence

This gives you a professional, reliable site without fighting shared hosting.
