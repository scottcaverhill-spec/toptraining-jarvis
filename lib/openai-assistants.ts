import OpenAI from "openai";
import type { TrainingAgent } from "./types";

export async function maybeCreateOpenAIAssistant(agent: TrainingAgent) {
  if (process.env.OPENAI_CREATE_ASSISTANTS !== "true") return undefined;
  if (!process.env.OPENAI_API_KEY) return undefined;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Optional mirror for teams that want OpenAI-hosted Assistants as well as the local Jarvis agent registry.
  // The app runs perfectly without this; the primary chat path uses the Responses/Vercel AI SDK flow.
  const beta = (client as unknown as { beta?: { assistants?: { create?: Function } } }).beta;
  if (!beta?.assistants?.create) return undefined;

  const assistant = await beta.assistants.create({
    name: agent.name,
    instructions: agent.instructions,
    model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
    metadata: {
      topTrainingAgentId: agent.id,
      role: agent.role
    }
  });

  return assistant?.id as string | undefined;
}
