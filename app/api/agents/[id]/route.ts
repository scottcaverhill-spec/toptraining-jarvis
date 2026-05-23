import { NextResponse } from "next/server";
import { deleteAgent, getAgent } from "@/lib/agent-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgent(id);
  if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });
  return NextResponse.json({ agent });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await deleteAgent(id);
  return NextResponse.json(result);
}
