import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { fastTrainingAnswer, generateSalesScript, roleplayStarter, searchTrainingMaterials } from "@/lib/training-tools";

export const academySearchTool = createTool({
  id: "academy-search",
  description: "Search Toyota of Portland Training Academy quick knowledge for policies, scripts, objections, CRM, product, and delivery topics.",
  inputSchema: z.object({
    query: z.string().describe("Training topic or question to search.")
  }),
  execute: async ({ context: { query } }) => {
    const answer = fastTrainingAnswer(query);
    const matches = searchTrainingMaterials(query);
    return {
      answer,
      matches: matches.map((item) => ({
        title: item.title,
        body: item.body,
        script: item.script || ""
      }))
    };
  }
});

export const scriptGeneratorTool = createTool({
  id: "script-generator",
  description: "Generate dealership-ready phone, text, email, objection, and appointment scripts.",
  inputSchema: z.object({
    topic: z.string().describe("Script topic, customer objection, or lead situation.")
  }),
  execute: async ({ context: { topic } }) => ({
    script: generateSalesScript(topic)
  })
});

export const rolePlayStarterTool = createTool({
  id: "role-play-starter",
  description: "Start a realistic Toyota dealership role-play scenario with a coaching target.",
  inputSchema: z.object({
    scenario: z.string().describe("Role-play scenario, objection, or customer situation.")
  }),
  execute: async ({ context: { scenario } }) => roleplayStarter(scenario)
});

export const objectionBankTool = createTool({
  id: "objection-bank",
  description: "Find quick objection-handling guidance from the academy database.",
  inputSchema: z.object({
    objection: z.string().describe("Customer objection or concern.")
  }),
  execute: async ({ context: { objection } }) => ({
    answer: fastTrainingAnswer(objection) || generateSalesScript(objection)
  })
});

export const crmNoteReviewTool = createTool({
  id: "crm-note-review",
  description: "Review a CRM note for manager readiness.",
  inputSchema: z.object({
    note: z.string().describe("CRM note text to review.")
  }),
  execute: async ({ context: { note } }) => {
    const checks = [
      ["lead source", /lead source|source/i.test(note)],
      ["vehicle", /rav4|camry|corolla|tacoma|tundra|sienna|highlander|grand highlander|prius|venza|4runner|land cruiser|vehicle|stock|vin/i.test(note)],
      ["customer need", /need|wants|looking for|must have|because|goal/i.test(note)],
      ["objection or question", /objection|question|concern|price|payment|trade|availability|think|spouse/i.test(note)],
      ["next action", /appointment|follow|call|text|email|next|task|scheduled/i.test(note)],
      ["manager involvement", /manager|to\b|turnover|desk/i.test(note)]
    ];
    const missing = checks.filter(([, passed]) => !passed).map(([label]) => label);
    return {
      score: Math.round(((checks.length - missing.length) / checks.length) * 100),
      missing,
      guidance:
        missing.length === 0
          ? "Manager-ready. Keep it factual and concise."
          : `Add: ${missing.join(", ")}. A good note should help the next manager or salesperson know exactly what happened and what is next.`
    };
  }
});

export const creativeAssetBuilderTool = createTool({
  id: "creative-asset-builder",
  description: "Create dealership-safe creative briefs, GIF concepts, meme captions, and social training ideas.",
  inputSchema: z.object({
    request: z.string().describe("Creative content request.")
  }),
  execute: async ({ context: { request } }) => ({
    brief: `Dealership-safe creative asset for: ${request}`,
    concept: "Show a professional sales associate turning a messy lead into a clean appointment.",
    scenes: [
      "Inbox is chaotic; caption: 'When the lead says just send your best price...'",
      "Salesperson asks one smart question and offers two appointment times.",
      "Calendar appointment appears; caption: 'Process beats panic.'"
    ],
    guardrails: "No real customer information, no mocking customers, no protected-class jokes, and no promises about credit/payment/trade/availability."
  })
});

export const jarvisTools = {
  academySearchTool,
  scriptGeneratorTool,
  rolePlayStarterTool,
  objectionBankTool,
  crmNoteReviewTool,
  creativeAssetBuilderTool
};
