import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { agentSystemPrompt, DEFAULT_MODEL } from "@/lib/jarvis";
import { getAgent, recordAgentRun } from "@/lib/agent-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const agentId = String(body?.agentId || "");
  const prompt = String(body?.prompt || "").trim();
  if (!agentId || !prompt) {
    return NextResponse.json({ error: "agentId and prompt are required." }, { status: 400 });
  }

  const agent = await getAgent(agentId);
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

  const result = await generateText({
    model: openai(DEFAULT_MODEL),
    system: agentSystemPrompt(agent),
    prompt
  });

  const run = await recordAgentRun(agent.id, prompt, result.text);
  return NextResponse.json({ run, reply: result.text });
}
