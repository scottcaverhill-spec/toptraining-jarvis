import { NextResponse } from "next/server";
import { getAgent, recordAgentRun } from "@/lib/agent-store";
import OpenAI from "openai";
import { agentSystemPrompt, DEFAULT_MODEL } from "@/lib/jarvis";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const agentId = String(body?.agentId || "");
  const prompt = String(body?.prompt || "").trim();
  if (!agentId || !prompt) {
    return NextResponse.json({ error: "agentId and prompt are required." }, { status: 400 });
  }

  const agent = await getAgent(agentId);
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const result = await client.responses.create({
    model: DEFAULT_MODEL,
    input: [
      { role: "system", content: agentSystemPrompt(agent) },
      { role: "user", content: prompt }
    ] as any
  });

  const reply = result.output_text || "";
  const run = await recordAgentRun(agent.id, prompt, reply);
  return NextResponse.json({ run, reply });
}
