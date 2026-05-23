# TOP Training Academy Jarvis

Jarvis is a Next.js 15 AI assistant for Toyota of Portland Training Academy. It provides a futuristic chat interface, voice input/output, wake-word listening, and an agent dashboard where managers or trainers can create specialized AI sales-training agents.

## What It Does

- Streams live AI responses with the Vercel AI SDK.
- Uses Mastra for the Jarvis Supervisor Agent, dynamic specialist agents, tools, and memory.
- Uses OpenAI through server-side API routes. The API key is never exposed to the browser.
- Lets Jarvis create specialized agents such as Objection Handler, Product Expert, Role-Play Simulator, Script Generator, CRM Follow-Up Coach, and Quiz Creator.
- Stores agent configurations and conversation history for local development.
- Provides a `/jarvis` page designed as a dark Jarvis-style HUD.
- Includes tool/function calls for creating, listing, deleting, switching, and running agents.
- Supports browser speech-to-text, text-to-speech, and optional “Hey Jarvis” wake listening.

## Mastra Agent System

Jarvis includes a Mastra layer under `src/mastra/`:

- `src/mastra/index.ts` registers the Jarvis Supervisor Agent with Mastra.
- `src/mastra/agents/jarvis-supervisor.ts` defines the primary supervisor.
- `src/mastra/agents/factory.ts` creates dynamic specialist agents from saved configs.
- `src/mastra/tools/training-tools.ts` exposes academy search, script generation, role-play, objection, CRM note review, and creative asset tools.
- `src/mastra/workflows/agent-creation.ts` provides the starter creation workflow schema.

Created agents are saved through `lib/agent-store.ts`. If Postgres env vars are available, the app creates `jarvis_agents` and `jarvis_agent_runs` tables automatically. Without Postgres, it falls back to local JSON/browser storage so testing does not break.

## Important Deployment Note

Full deployment instructions now live in:

```text
DEPLOYMENT_OPTIONS.md
```

Short version: use **Vercel + GoDaddy DNS** for the full Jarvis experience. Use the GoDaddy cPanel Node path only as a fallback.

The current GoDaddy/cPanel static hosting can serve HTML, CSS, and JavaScript, but it cannot run a full Next.js App Router server with streaming API routes by itself.

Use one of these for the real Jarvis app:

- Vercel, recommended
- Render
- Railway
- A VPS with Node.js
- GoDaddy/cPanel Node.js App, if your hosting plan includes Node.js

Then point `https://toptrainingacademy.com/jarvis` to that deployment by subdomain, reverse proxy, or redirect. The current static `/jarvis` page can stay in place until this is deployed.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/jarvis
```

## GoDaddy / cPanel Node.js Setup

If your cPanel has **Setup Node.js App**, use this project as the Node app.

Recommended cPanel settings:

```text
Node.js version: 20.x or newer
Application mode: Production
Application root: toptraining-jarvis-next-20260522
Application URL: jarvis or a subdomain like jarvis.toptrainingacademy.com
Application startup file: server.js
```

After uploading the folder:

```bash
npm install
npm run build
```

Then restart the Node app from cPanel.

If cPanel asks for a startup command, use:

```bash
npm start
```

If the full Next build fails on shared hosting, the included `server.js` can still run the GoDaddy-safe fallback:

```bash
USE_STATIC_JARVIS=true npm start
```

The fallback keeps Jarvis online, but it is not the full App Router/Vercel AI SDK version.

## Environment Variables

```text
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.4-mini
TOP_ACADEMY_CHAT_API=https://toptrainingacademy.com/api/chat
AGENT_STORE_PATH=./data/agents.json
POSTGRES_URL=
POSTGRES_DATABASE_URL=
AGENT_DATABASE_URL=
MASTRA_LIBSQL_URL=
USE_MASTRA_SUPERVISOR=false
OPENAI_CREATE_ASSISTANTS=false
```

## Production Data

The included JSON/browser fallback is good for local development and testing. For production, add Vercel Postgres, Neon, Supabase Postgres, or another Postgres-compatible database and set `POSTGRES_URL`, `POSTGRES_DATABASE_URL`, or `AGENT_DATABASE_URL`.

## Future RAG Upgrade

The code includes clear integration points for:

- Training manual PDF retrieval
- SOP/policy search
- File search/vector store
- Per-agent knowledge bases
- CRM/tool integrations
