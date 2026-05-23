import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { buildAgentInstructions, inferTools, STARTER_AGENTS } from "./jarvis";
import type { AgentRun, AgentStore, TrainingAgent } from "./types";

const STORE_PATH = process.env.AGENT_STORE_PATH
  ? resolve(process.env.AGENT_STORE_PATH)
  : process.env.VERCEL
    ? "/tmp/toptraining-jarvis-agents.json"
    : resolve(process.cwd(), "./data/agents.json");

let memoryStore: AgentStore | null = null;

function now() {
  return new Date().toISOString();
}

function starterStore(): AgentStore {
  const timestamp = now();
  return {
    agents: STARTER_AGENTS.map((agent) => ({
      ...agent,
      createdAt: timestamp,
      updatedAt: timestamp,
      runCount: 0
    })),
    runs: []
  };
}

async function ensureStore() {
  if (memoryStore) return;
  try {
    await mkdir(dirname(STORE_PATH), { recursive: true });
    await readFile(STORE_PATH, "utf8");
  } catch {
    await writeStore(starterStore());
  }
}

export async function readStore(): Promise<AgentStore> {
  await ensureStore();
  if (memoryStore) return memoryStore;
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as AgentStore;
    return {
      agents: Array.isArray(parsed.agents) ? parsed.agents : [],
      runs: Array.isArray(parsed.runs) ? parsed.runs : []
    };
  } catch {
    return starterStore();
  }
}

export async function writeStore(store: AgentStore) {
  try {
    await mkdir(dirname(STORE_PATH), { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    memoryStore = null;
  } catch {
    memoryStore = store;
  }
}

export async function listAgents() {
  const store = await readStore();
  return store.agents;
}

export async function getAgent(id?: string | null) {
  if (!id) return null;
  const store = await readStore();
  return store.agents.find((agent) => agent.id === id) || null;
}

export async function createAgent(input: {
  name?: string;
  role?: string;
  goal: string;
  instructions?: string;
  knowledgeBase?: string[];
  assistantId?: string;
}) {
  const store = await readStore();
  const timestamp = now();
  const goal = input.goal.trim();
  const baseName = input.name?.trim() || goal.replace(/^create an? agent (for|to)?/i, "").trim();
  const name = baseName ? `${baseName[0].toUpperCase()}${baseName.slice(1)}` : "Specialized Training Agent";
  const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${randomUUID().slice(0, 8)}`;

  const agent: TrainingAgent = {
    id,
    name,
    role: input.role?.trim() || "Specialized Toyota of Portland training coach",
    goal,
    instructions: input.instructions?.trim() || buildAgentInstructions(goal),
    tools: inferTools(goal),
    knowledgeBase: input.knowledgeBase?.length ? input.knowledgeBase : ["Toyota of Portland Training Academy"],
    assistantId: input.assistantId,
    createdAt: timestamp,
    updatedAt: timestamp,
    runCount: 0
  };

  store.agents.unshift(agent);
  await writeStore(store);
  return agent;
}

export async function deleteAgent(id: string) {
  const store = await readStore();
  const before = store.agents.length;
  store.agents = store.agents.filter((agent) => agent.id !== id);
  store.runs = store.runs.filter((run) => run.agentId !== id);
  await writeStore(store);
  return { deleted: store.agents.length !== before };
}

export async function setAgentAssistantId(id: string, assistantId: string) {
  const store = await readStore();
  let updated: TrainingAgent | null = null;
  store.agents = store.agents.map((agent) => {
    if (agent.id !== id) return agent;
    updated = { ...agent, assistantId, updatedAt: now() };
    return updated;
  });
  await writeStore(store);
  return updated;
}

export async function recordAgentRun(agentId: string, prompt: string, result: string): Promise<AgentRun> {
  const store = await readStore();
  const timestamp = now();
  const run: AgentRun = {
    id: randomUUID(),
    agentId,
    prompt,
    result,
    createdAt: timestamp
  };
  store.runs.unshift(run);
  store.runs = store.runs.slice(0, 500);
  store.agents = store.agents.map((agent) =>
    agent.id === agentId
      ? { ...agent, lastRunAt: timestamp, runCount: (agent.runCount || 0) + 1, updatedAt: timestamp }
      : agent
  );
  await writeStore(store);
  return run;
}
