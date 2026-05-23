# Jarvis Go-Live Plan

Recommended path: keep GoDaddy running the main Training Academy and move full Jarvis AI to Vercel at `jarvis.toptrainingacademy.com`.

## Why This Is Best

- The main academy stays stable on GoDaddy.
- Jarvis gets proper Next.js hosting, API routes, streaming, and future agent/RAG support.
- We avoid fighting shared-hosting memory/timeouts.
- The current `https://toptrainingacademy.com/jarvis/` can stay live until the Vercel version is verified.

## Current Safe State

- Main academy stays at `https://toptrainingacademy.com/`.
- Existing Jarvis remains at `https://toptrainingacademy.com/jarvis/`.
- The switch-view page can keep linking to `/jarvis/` for now.

## Go-Live Order

1. Deploy this folder to Vercel.
2. Set Vercel environment variables.
3. Add `jarvis.toptrainingacademy.com` in Vercel.
4. Add the GoDaddy DNS CNAME for `jarvis`.
5. Verify the Vercel Jarvis page and API.
6. Only after it works, replace GoDaddy `/public_html/jarvis/index.html` with either:
   - `deploy/godaddy-jarvis-redirect.html`, recommended, or
   - `deploy/godaddy-jarvis-embed.html`, only if iframe microphone behavior tests well.

## Vercel Environment Variables

Use these in Vercel Project Settings > Environment Variables:

```text
OPENAI_API_KEY=your_real_key
OPENAI_MODEL=gpt-5.4-mini
NEXT_PUBLIC_BASE_PATH=
AGENT_STORE_PATH=/tmp/agents.json
OPENAI_CREATE_ASSISTANTS=false
```

Important: `/tmp/agents.json` is temporary. For real agent history, replace this with Supabase, Vercel Postgres, Neon, or another database.

## GoDaddy DNS

In GoDaddy DNS for `toptrainingacademy.com`, add:

```text
Type: CNAME
Name: jarvis
Value: cname.vercel-dns.com
TTL: default
```

Then in Vercel add:

```text
jarvis.toptrainingacademy.com
```

## Final Test Checklist

- `https://jarvis.toptrainingacademy.com/` loads.
- Jarvis chat replies.
- Voice mic opens on Chrome.
- Text-to-speech works.
- Agent list loads.
- Create agent works.
- Delete agent works.
- Main academy switch-view Jarvis button opens Jarvis.
- Mobile opens Jarvis without landscape mode.

## Rollback

If Vercel or DNS has a problem, leave GoDaddy `/jarvis/` as-is. The existing live fallback remains available.
