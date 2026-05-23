import { z } from "zod";
import { createAgent } from "@/lib/agent-store";

export const agentCreationRequestSchema = z.object({
  name: z.string().optional(),
  goal: z.string().min(3),
  role: z.string().optional(),
  instructions: z.string().optional()
});

export async function createSpecializedAgentFromRequest(input: z.infer<typeof agentCreationRequestSchema>) {
  const request = agentCreationRequestSchema.parse(input);
  return createAgent({
    name: request.name,
    role: request.role,
    goal: request.goal,
    instructions: request.instructions
  });
}
