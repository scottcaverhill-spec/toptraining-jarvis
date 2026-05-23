import { NextResponse } from "next/server";
import { createAgent, listAgents, setAgentAssistantId } from "@/lib/agent-store";
import { maybeCreateOpenAIAssistant } from "@/lib/openai-assistants";

export async function GET() {
  const agents = await listAgents();
  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const goal = String(body?.goal || "").trim();
  if (!goal) {
    return NextResponse.json({ error: "Agent goal is required." }, { status: 400 });
  }

  const agent = await createAgent({
    name: body?.name,
    role: body?.role,
    goal,
    instructions: body?.instructions,
    knowledgeBase: Array.isArray(body?.knowledgeBase) ? body.knowledgeBase : undefined
  });

  const assistantId = await maybeCreateOpenAIAssistant(agent);
  if (assistantId) {
    const updated = await setAgentAssistantId(agent.id, assistantId);
    return NextResponse.json({ agent: updated });
  }

  return NextResponse.json({ agent });
}
