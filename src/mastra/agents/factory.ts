import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { jarvisTools } from "../tools/training-tools";
import type { TrainingAgent, TrainingAgentTool } from "@/lib/types";

export const MASTRA_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const baseMemory = new Memory({
  options: {
    lastMessages: 12
  }
});

export function toolMapForAgent(tools: TrainingAgentTool[] = []) {
  const selected: Record<string, unknown> = {
    academySearchTool: jarvisTools.academySearchTool
  };

  if (tools.includes("script_generator")) selected.scriptGeneratorTool = jarvisTools.scriptGeneratorTool;
  if (tools.includes("roleplay")) selected.rolePlayStarterTool = jarvisTools.rolePlayStarterTool;
  if (tools.includes("objection_bank")) selected.objectionBankTool = jarvisTools.objectionBankTool;
  if (tools.includes("crm_note_review")) selected.crmNoteReviewTool = jarvisTools.crmNoteReviewTool;
  if (tools.includes("creative_asset_builder")) selected.creativeAssetBuilderTool = jarvisTools.creativeAssetBuilderTool;
  if (tools.includes("product_specs")) selected.academySearchTool = jarvisTools.academySearchTool;
  if (tools.includes("quiz_builder")) selected.academySearchTool = jarvisTools.academySearchTool;

  return selected;
}

export function createMastraAgentFromConfig(agent: TrainingAgent) {
  return new Agent({
    id: agent.id,
    name: agent.name,
    description: `${agent.role}: ${agent.goal}`,
    instructions: `${agent.instructions}

You are operating as a real Jarvis specialist agent, not just a prompt.
Use your tools when they can answer faster or more accurately.
Keep answers practical for Toyota of Portland Training Academy.
Avoid promises about credit approval, APR, exact payment, trade value, or vehicle availability without verification.
If exact store policy is required, say: "Please confirm the exact store policy with management."`,
    model: openai(MASTRA_MODEL),
    memory: baseMemory,
    tools: toolMapForAgent(agent.tools) as any,
    metadata: {
      topTrainingAgentId: agent.id,
      role: agent.role,
      source: "dynamic-agent-registry"
    }
  });
}
