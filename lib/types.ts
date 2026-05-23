export type TrainingAgentTool =
  | "training_search"
  | "script_generator"
  | "roleplay"
  | "objection_bank"
  | "product_specs"
  | "crm_note_review"
  | "quiz_builder"
  | "creative_asset_builder";

export type TrainingAgent = {
  id: string;
  name: string;
  role: string;
  goal: string;
  instructions: string;
  tools: TrainingAgentTool[];
  knowledgeBase: string[];
  assistantId?: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  runCount: number;
};

export type AgentRun = {
  id: string;
  agentId: string;
  prompt: string;
  result: string;
  createdAt: string;
};

export type AgentStore = {
  agents: TrainingAgent[];
  runs: AgentRun[];
};

export type JarvisMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
