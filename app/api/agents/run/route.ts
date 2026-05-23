import { NextResponse } from "next/server";
import { getAgent, recordAgentRun } from "@/lib/agent-store";
import { createMastraAgentFromConfig } from "@/src/mastra";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const agentId = String(body?.agentId || "");
  const prompt = String(body?.prompt || "").trim();
  if (!agentId || !prompt) {
    return NextResponse.json({ error: "agentId and prompt are required." }, { status: 400 });
  }

  const agent = await getAgent(agentId);
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

  const mastraAgent = createMastraAgentFromConfig(agent);
  const result = await mastraAgent.generate(prompt);

  const reply = result.text || "";
  const run = await recordAgentRun(agent.id, prompt, reply);
  return NextResponse.json({ run, reply });
}
