import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createAgent, getAgent, listAgents } from "@/lib/agent-store";
import { agentSystemPrompt, buildAgentInstructions, DEFAULT_MODEL } from "@/lib/jarvis";
import { generateSalesScript, roleplayStarter, searchTrainingMaterials } from "@/lib/training-tools";
import type { CoreMessage } from "ai";

export const maxDuration = 60;
const REQUEST_TIMEOUT_MS = 25000;

function normalizeMessages(messages: CoreMessage[]) {
  return messages
    .slice(-16)
    .map((message) => {
      const content = typeof message.content === "string" ? message.content : JSON.stringify(message.content);
      return {
        role: message.role === "assistant" ? "assistant" : "user",
        content
      };
    })
    .filter((message) => message.content.trim());
}

async function maybeHandleLocalToolRequest(latest: string) {
  const text = latest.toLowerCase();

  if (/^\\s*(list|show).*agents?/.test(text)) {
    return `Available Jarvis agents:\\n${(await listAgents())
      .map((agent) => `- ${agent.name}: ${agent.goal}`)
      .join("\\n")}`;
  }

  const createMatch = latest.match(/create (?:an? )?(?:specialized )?(?:ai )?agent (?:for|to|that)\\s+(.+)/i);
  if (createMatch?.[1]) {
    const agent = await createAgent({ goal: createMatch[1].trim() });
    return formatAgentBuild(agent.name, agent.role, agent.goal, agent.instructions);
  }

  const buildMatch = latest.match(/(?:build|program|design|make|set up|outline) (?:an? )?(?:specialized )?(?:ai )?agent (?:for|to|that)?\\s*(.+)?/i);
  if (buildMatch) {
    const goal = (buildMatch[1] || "a Toyota of Portland sales training task").trim();
    const agent = await createAgent({ goal });
    return formatAgentBuild(agent.name, agent.role, agent.goal, agent.instructions);
  }

  if (/gif|meme|funny|image|social post|caption|creative|graphic/i.test(latest)) {
    const goal = `Create dealership-safe creative asset support for: ${latest}`;
    const agent = await createAgent({
      name: "Funny GIF Builder Agent",
      role: "Dealership-safe creative asset coach",
      goal,
      instructions:
        "Build friendly, professional GIF concepts, meme captions, social posts, and creative briefs for dealership training. Keep humor clean, inclusive, customer-respectful, and Toyota of Portland appropriate."
    });
    return `${formatAgentBuild(agent.name, agent.role, agent.goal, agent.instructions)}

Funny GIF asset brief:
- Concept: A salesperson calmly turning a messy lead into a clean appointment.
- Scene 1: Inbox chaos with the caption "When the lead says just send your best price..."
- Scene 2: Salesperson asks one smart question and offers two appointment times.
- Scene 3: Clean calendar appointment appears with the caption "Process beats panic."
- Tone: Light, positive, dealership-safe.
- Do not use real customer names, phone numbers, private lead details, or negative jokes about customers.

Prompt for a future image/GIF tool:
"Create a clean, funny dealership training GIF concept in Toyota red, black, white, and gray. Show a professional sales associate organizing internet leads into appointments. Friendly humor, no customer personal information, no mocking customers, polished corporate training style."`;
  }

  if (/\bagent\b/i.test(latest)) {
    const goal = latest
      .replace(/^(i|we|a salesperson|salesperson|sales person)\s+(need|needs|want|wants|would like)\s+(an? )?/i, "")
      .replace(/^(make|build|create|program|design|set up)\s+(an? )?/i, "")
      .replace(/^agent\s+(for|to|that)\s+/i, "")
      .replace(/^an?\s+agent\s+(for|to|that)\s+/i, "")
      .trim() || "a Toyota of Portland training task";
    const agent = await createAgent({ goal });
    return formatAgentBuild(agent.name, agent.role, agent.goal, agent.instructions);
  }

  if (/role.?play|roleplay|pretend.*customer/i.test(latest)) {
    const scenario = latest.replace(/start|role.?play|roleplay|with|customer/gi, " ").trim() || "common showroom objection";
    const roleplay = roleplayStarter(scenario);
    return `Scenario: ${roleplay.scenario}\\nCustomer: "${roleplay.customerLine}"\\nCoach target: ${roleplay.coachingTarget}`;
  }

  if (/script|voicemail|text message|email/i.test(latest)) {
    return generateSalesScript(latest);
  }

  if (/search|training material|training guide|policy|crm|toyota|objection|delivery/i.test(latest)) {
    const results = searchTrainingMaterials(latest);
    if (results.length) {
      return `I found these training references:\\n${results.map((item) => `- ${item.title}: ${item.body}`).join("\\n")}`;
    }
  }

  return "";
}

function formatAgentBuild(name: string, role: string, goal: string, instructions: string) {
  return `Built inside the academy: ${name}

Role:
${role}

Goal:
${goal}

System prompt:
${instructions || buildAgentInstructions(goal)}

Tools this agent should use:
- Training guide search
- Script generator
- Role-play simulator
- Objection bank
- Manager-ready scoring rubric

Workflow:
1. Ask the employee for the customer situation, lead source, vehicle, and main objection.
2. Generate a compliant first response, then a stronger manager-ready response.
3. Run a 5-turn role-play.
4. Score the employee on opening, discovery, process, objection handling, confidence, TO timing, and next step.
5. Save the transcript for manager review.

Sample opening:
"Tell me the lead source, vehicle, customer concern, and what you already said. I will coach the next response and then role-play the customer."

Pass standard:
The employee must stay customer-centered, ask at least one useful discovery question, avoid promises on credit/payment/trade/availability, and set a clear next step.

What works now:
This agent is created now inside Jarvis. I can define the agent, add it to the Jarvis agent list, generate scripts, run role-play, create scoring guidance, and build usable training workflows inside the academy.

Outside-system automation:
The agent exists now. If you later want it to push records into Focus/Reynolds, send texts, log calls, pull Google data, or route live leads automatically, that connection needs approved account/API access. Until then, the agent still works as a training, scripting, coaching, role-play, and workflow builder.`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages: CoreMessage[] = Array.isArray(body?.messages) ? body.messages : [];
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

  const latest = normalizeMessages(messages).at(-1)?.content || "";
  const localToolContext = await maybeHandleLocalToolRequest(latest);
  if (localToolContext.startsWith("Built inside the academy:")) {
    return NextResponse.json({ reply: localToolContext });
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content: `${agentSystemPrompt(activeAgent || undefined)}

Local training tool context:
${localToolContext || "No local tool context was needed for this request."}`
        },
        ...normalizeMessages(messages)
      ] as any
    }, {
      signal: controller.signal
    });

    return NextResponse.json({ reply: response.output_text || "Jarvis did not return text for that request." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI request failed.";
    console.error("Jarvis OpenAI request failed:", message);
    if (localToolContext) {
      return NextResponse.json({
        reply: `${localToolContext}\n\nNote: OpenAI was temporarily unavailable, so I used the built-in training tools for this response.`
      });
    }
    return NextResponse.json({
      reply:
        "Jarvis is online, but the OpenAI service did not answer cleanly on that request. Here is the useful training move: keep the answer customer-centered, ask one clarifying question, avoid promises on credit/payment/trade/availability, and set a clear next step. Try a shorter prompt or ask me to role-play one specific objection."
    });
  } finally {
    clearTimeout(timeout);
  }
}
