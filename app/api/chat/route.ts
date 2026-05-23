import { NextResponse } from "next/server";
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { createAgent, deleteAgent, getAgent, listAgents } from "@/lib/agent-store";
import { agentSystemPrompt, DEFAULT_MODEL } from "@/lib/jarvis";
import { generateSalesScript, roleplayStarter, searchTrainingMaterials } from "@/lib/training-tools";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const activeAgentId = body?.activeAgentId ? String(body.activeAgentId) : undefined;
  const activeAgent = await getAgent(activeAgentId);

  if (!messages.length) {
    return NextResponse.json({ error: "At least one message is required." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY && process.env.TOP_ACADEMY_CHAT_API) {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    const response = await fetch(process.env.TOP_ACADEMY_CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: lastUser?.content || "",
        history: messages.slice(-12).map((message) => ({ role: message.role, content: message.content }))
      })
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ reply: data.reply || "Jarvis could not reach the fallback Academy API." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  const result = streamText({
    model: openai(DEFAULT_MODEL),
    system: agentSystemPrompt(activeAgent || undefined),
    messages,
    tools: {
      createTrainingAgent: tool({
        description: "Create a specialized Toyota of Portland Training Academy AI agent.",
        parameters: z.object({
          goal: z.string().describe("The training problem this agent should solve."),
          name: z.string().optional().describe("Short agent name."),
          role: z.string().optional().describe("The agent's specialist role.")
        }),
        execute: async ({ goal, name, role }) => {
          const agent = await createAgent({ goal, name, role });
          return { created: true, agent };
        }
      }),
      listTrainingAgents: tool({
        description: "List available specialized training agents.",
        parameters: z.object({}),
        execute: async () => ({ agents: await listAgents() })
      }),
      deleteTrainingAgent: tool({
        description: "Delete a specialized training agent by ID.",
        parameters: z.object({ agentId: z.string() }),
        execute: async ({ agentId }) => deleteAgent(agentId)
      }),
      searchTrainingMaterials: tool({
        description: "Search known Toyota of Portland training snippets. Future RAG/vector store plugs in here.",
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => ({ results: searchTrainingMaterials(query) })
      }),
      generateSalesScript: tool({
        description: "Generate a short dealership-ready script for a sales situation.",
        parameters: z.object({ topic: z.string() }),
        execute: async ({ topic }) => ({ script: generateSalesScript(topic) })
      }),
      startRoleplay: tool({
        description: "Start a realistic customer role-play scenario.",
        parameters: z.object({ scenario: z.string() }),
        execute: async ({ scenario }) => roleplayStarter(scenario)
      })
    }
  });

  return result.toDataStreamResponse();
}
