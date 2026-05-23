"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  BrainCircuit,
  ChevronLeft,
  Download,
  Mic,
  Plus,
  Radio,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  Wand2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { JarvisMessage, TrainingAgent } from "@/lib/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
};

const STORAGE_KEY = "toptraining-jarvis-chat-v1";
const ACTIVE_AGENT_KEY = "toptraining-jarvis-active-agent-v1";
const API_BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  agentName: "Jarvis",
  content:
    "Jarvis online. I can coach sales process, create specialist agents, role-play customers, sharpen scripts, inspect CRM notes, and keep training from becoming expensive wallpaper. What shall we improve first?"
};

const quickCommands = [
  "Create an agent for handling price objections.",
  "Start a role-play with a customer who says they need to think about it.",
  "Build a phone script for a new internet lead.",
  "Review this CRM note for manager readiness.",
  "Explain Toyota Safety Sense in customer-friendly language.",
  "Create a 10-question quiz on lead handling."
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function toAiMessages(messages: ChatMessage[]): JarvisMessage[] {
  return messages
    .filter((message) => message.id !== "welcome")
    .slice(-16)
    .map((message) => ({ role: message.role, content: message.content }));
}

export default function JarvisConsole() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState("");
  const [agents, setAgents] = useState<TrainingAgent[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wakeArmed, setWakeArmed] = useState(false);
  const [agentGoal, setAgentGoal] = useState("");
  const [agentName, setAgentName] = useState("");
  const [lastError, setLastError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeAgent = useMemo(
    () => agents.find((agent) => agent.id === activeAgentId) || null,
    [agents, activeAgentId]
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      } catch {}
    }
    setActiveAgentId(localStorage.getItem(ACTIVE_AGENT_KEY) || "");
    void refreshAgents();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-80)));
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_AGENT_KEY, activeAgentId);
  }, [activeAgentId]);

  async function refreshAgents() {
    try {
      const response = await fetch(`${API_BASE}/api/agents`, { cache: "no-store" });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.warn("Jarvis agent refresh failed", error);
    }
  }

  async function sendMessage(text = input) {
    const clean = text.trim();
    if (!clean || isSending) return;

    setInput("");
    setLastError("");
    setIsSending(true);
    const userMessage: ChatMessage = { id: uid(), role: "user", content: clean };
    const assistantId = uid();
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", agentName: activeAgent?.name || "Jarvis", content: "" }
    ]);

    try {
      const requestMessages = toAiMessages([...messages, userMessage]);
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages, activeAgentId })
      });

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) throw new Error(await response.text());

      if (contentType.includes("application/json")) {
        const data = await response.json();
        updateAssistantMessage(assistantId, data.reply || "Jarvis received an empty reply.");
      } else {
        await readStream(response, assistantId);
      }
      void refreshAgents();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Request failed";
      setLastError(detail);
      updateAssistantMessage(
        assistantId,
        "I could not reach the Jarvis API cleanly. Check the server environment and OPENAI_API_KEY. Even genius needs a power source.",
        true
      );
    } finally {
      setIsSending(false);
    }
  }

  async function readStream(response: Response, messageId: string) {
    const reader = response.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const text = extractTextFromAiStream(buffer);
      updateAssistantMessage(messageId, text || buffer);
    }
  }

  function extractTextFromAiStream(raw: string) {
    // Vercel AI data stream chunks often look like: 0:"text"
    const lines = raw.split("\n");
    let text = "";
    for (const line of lines) {
      if (!line.startsWith("0:")) continue;
      try {
        text += JSON.parse(line.slice(2));
      } catch {}
    }
    return text;
  }

  function updateAssistantMessage(id: string, content: string, error = false) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, content: error ? `⚠ ${content}` : content } : message
      )
    );
  }

  async function createAgent() {
    const goal = agentGoal.trim();
    if (!goal) return;
    const response = await fetch(`${API_BASE}/api/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, name: agentName })
    });
    const data = await response.json();
    setAgentGoal("");
    setAgentName("");
    await refreshAgents();
    if (data.agent?.id) setActiveAgentId(data.agent.id);
  }

  async function deleteAgent(id: string) {
    if (!confirm("Delete this Jarvis agent?")) return;
    await fetch(`${API_BASE}/api/agents/${id}`, { method: "DELETE" });
    if (activeAgentId === id) setActiveAgentId("");
    await refreshAgents();
  }

  function speakLast() {
    if (!("speechSynthesis" in window)) return;
    const last = [...messages].reverse().find((message) => message.role === "assistant");
    if (!last?.content) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(last.content);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => /british|uk|daniel|george|arthur/i.test(`${voice.name} ${voice.lang}`)) ||
      voices.find((voice) => /en-gb/i.test(voice.lang)) ||
      voices.find((voice) => /en/i.test(voice.lang)) ||
      null;
    utterance.rate = 0.96;
    utterance.pitch = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening(wakeMode = false) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLastError("Speech recognition is not available in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = wakeMode;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      if (wakeArmed && wakeMode) setTimeout(() => toggleListening(true), 400);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (!transcript) return;
      if (wakeMode) {
        const match = transcript.match(/hey jarvis[:,]?\s*(.*)/i);
        if (match?.[1]) void sendMessage(match[1]);
      } else {
        setInput((current) => `${current}${current ? " " : ""}${transcript}`);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function exportConversation() {
    const blob = new Blob([JSON.stringify({ messages, agents, exportedAt: new Date().toISOString() }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jarvis-conversation-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearChat() {
    if (!confirm("Clear this browser's Jarvis conversation history?")) return;
    setMessages([welcome]);
  }

  return (
    <main className="relative min-h-screen px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 xl:grid-cols-[330px_1fr_360px]">
        <aside className="space-y-4">
          <Card className="hud-scan">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge>Jarvis Online</Badge>
                <a href="/" className="inline-flex items-center gap-1 text-sm font-bold text-slate-300 hover:text-toyota-cyan">
                  <ChevronLeft size={16} /> Academy
                </a>
              </div>
              <CardTitle className="text-3xl">TOP Jarvis</CardTitle>
              <p className="text-sm leading-6 text-slate-400">
                AI sales coach, agent dispatcher, role-play partner, product explainer, and CRM note critic.
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wand2 size={19} /> Quick Commands</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {quickCommands.map((command) => (
                <Button key={command} variant="outline" className="h-auto justify-start whitespace-normal py-3 text-left" onClick={() => void sendMessage(command)}>
                  {command}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Radio size={19} /> Voice System</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant={isListening ? "danger" : "cyan"} onClick={() => toggleListening(false)}>
                <Mic size={18} /> {isListening ? "Listening..." : "Voice Input"}
              </Button>
              <Button variant="outline" onClick={() => { setWakeArmed((value) => !value); toggleListening(true); }}>
                Hey Jarvis {wakeArmed ? "Armed" : "Wake Word"}
              </Button>
              <Button variant="ghost" onClick={speakLast}>
                <Volume2 size={18} /> Speak Last Reply
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-hud backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <Badge className="mb-2">Toyota of Portland Training Academy</Badge>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Jarvis Command Console</h1>
              <p className="mt-2 text-sm text-slate-400">
                Active agent: <span className="font-bold text-toyota-cyan">{activeAgent?.name || "Jarvis Core"}</span>
              </p>
            </div>
            <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40">
              <div className={`orb absolute inset-0 rounded-full shadow-hud ${isListening || isSending ? "animate-pulse" : ""}`} />
            </div>
          </div>

          <div ref={messagesRef} className="flex-1 space-y-4 overflow-auto p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] rounded-3xl border p-4 shadow-lg ${
                  message.role === "user"
                    ? "ml-auto border-toyota-red/45 bg-toyota-red/20"
                    : "mr-auto border-toyota-cyan/25 bg-white/[.075]"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-slate-400">
                  {message.role === "user" ? "You" : message.agentName || "Jarvis"}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-6 text-slate-100 sm:text-base">
                  {message.content || (isSending && message.role === "assistant" ? "Scanning the training matrix..." : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 bg-black/35 p-4">
            {lastError ? <p className="mb-2 rounded-xl border border-red-500/30 bg-red-950/30 p-2 text-xs text-red-100">{lastError}</p> : null}
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Textarea
                value={input}
                placeholder="Ask Jarvis to create an agent, role-play an objection, build a script, review a CRM note..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
              />
              <Button size="lg" disabled={isSending || !input.trim()} onClick={() => void sendMessage()}>
                <Send size={18} /> Send
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
              <span>Enter sends. Shift + Enter adds a line. Cmd/Ctrl + K focuses input.</span>
              <span>Conversation stored in this browser.</span>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit size={19} /> Agent Management</CardTitle>
              <p className="text-sm text-slate-400">Create a specialized agent for any sales training task.</p>
            </CardHeader>
            <CardContent className="grid gap-3">
              <input
                className="h-11 rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-toyota-cyan"
                placeholder="Agent name, optional"
                value={agentName}
                onChange={(event) => setAgentName(event.target.value)}
              />
              <Textarea
                placeholder="Goal: Create an agent for handling price objections..."
                value={agentGoal}
                onChange={(event) => setAgentGoal(event.target.value)}
              />
              <Button onClick={() => void createAgent()} disabled={!agentGoal.trim()}>
                <Plus size={18} /> Create Agent
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot size={19} /> Agent Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="grid max-h-[520px] gap-3 overflow-auto pr-1">
              <Button variant={!activeAgentId ? "cyan" : "outline"} onClick={() => setActiveAgentId("")}>
                Jarvis Core
              </Button>
              {agents.map((agent) => (
                <div key={agent.id} className={`rounded-2xl border p-3 ${agent.id === activeAgentId ? "border-toyota-cyan bg-toyota-cyan/10" : "border-white/10 bg-white/[.04]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <button className="text-left" onClick={() => setActiveAgentId(agent.id)}>
                      <strong className="block text-sm text-white">{agent.name}</strong>
                      <span className="mt-1 block text-xs text-slate-400">{agent.role}</span>
                    </button>
                    <button className="text-slate-500 hover:text-red-300" onClick={() => void deleteAgent(agent.id)} aria-label={`Delete ${agent.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{agent.goal}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.tools.slice(0, 3).map((tool) => (
                      <span key={tool} className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">
                        {tool.replaceAll("_", " ")}
                      </span>
                    ))}
                  </div>
                  <Button className="mt-3 w-full" variant="ghost" size="sm" onClick={() => void sendMessage(`Use ${agent.name} to help me with: `)}>
                    Trigger Agent
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles size={19} /> Session Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" onClick={exportConversation}><Download size={17} /> Export Conversation</Button>
              <Button variant="danger" onClick={clearChat}><Trash2 size={17} /> Clear Chat</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
