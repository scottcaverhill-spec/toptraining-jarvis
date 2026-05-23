type KnowledgeItem = {
  title: string;
  tags: string[];
  body: string;
  script?: string;
};

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    title: "20/3 Rule",
    tags: ["20/3", "activity", "contacts", "proposals", "daily"],
    body: "Toyota of Portland expects consistent daily activity: 20 meaningful contacts and 3 proposals. Meaningful contacts should move a customer forward, confirm intent, set an appointment, revive a lead, or advance a deal.",
    script:
      "My focus today is 20 meaningful customer contacts and 3 real proposals. I am not just checking boxes; I am creating appointments, follow-up, and next steps."
  },
  {
    title: "Internet Lead Handling",
    tags: ["lead", "internet", "website", "autotrader", "cars.com", "cargurus", "truecar", "costco", "facebook"],
    body: "A strong internet lead response should acknowledge the vehicle/request, answer what can be verified, ask one useful question, and offer two appointment times. Do not paste the entire lead back to the customer.",
    script:
      "Hi [First Name], this is [Salesperson] with Toyota of Portland. I received your request on the [Vehicle]. I can help confirm the details and answer your questions. Are you available at [Time A] or [Time B] today to take a closer look?"
  },
  {
    title: "Inbound Phone Call",
    tags: ["phone", "inbound", "call", "appointment", "availability"],
    body: "The phone goal is not to become a brochure. Confirm the vehicle, get the customer name and callback number, ask one qualifying question, and set a specific appointment.",
    script:
      "Absolutely, you called the right place. This is [Salesperson] at Toyota of Portland. Which vehicle caught your eye?"
  },
  {
    title: "Best Price Objection",
    tags: ["price", "best price", "discount", "out the door", "otd", "quote"],
    body: "A strong price response slows the race to the bottom, confirms the exact vehicle, and moves toward a complete deal structure. Avoid unsupported final numbers.",
    script:
      "I will gladly help with pricing. To make sure I am comparing the right vehicle and the right structure, are you looking at this exact trim and equipment, and do you have a trade or financing involved?"
  },
  {
    title: "Payment Objection",
    tags: ["payment", "monthly", "apr", "rate", "finance"],
    body: "Do not promise payment, rate, or approval. Clarify the target and bring the deal back to vehicle, cash down, term, trade, and finance review.",
    script:
      "I understand wanting the payment to fit. Payment depends on the vehicle, money down, term, taxes, trade, and approved finance options. Are you trying to stay under a certain monthly range?"
  },
  {
    title: "Trade Value Boundary",
    tags: ["trade", "appraisal", "value", "payoff", "negative equity"],
    body: "Do not promise trade value before an appraisal. Explain that condition, miles, equipment, payoff, and market demand all matter.",
    script:
      "I can help get you a real number. The accurate value depends on condition, miles, equipment, and market demand, so the quickest solid answer is a live appraisal. Can you bring it with you?"
  },
  {
    title: "CRM Notes",
    tags: ["crm", "notes", "focus", "reynolds", "follow-up", "task"],
    body: "A manager-ready CRM note includes customer need, vehicle, lead source, objection, appointment/next action, and whether a manager was involved. Keep it factual and useful to the next person.",
    script:
      "Lead source: [source]. Customer interested in [vehicle]. Need/use case: [need]. Objection/question: [objection]. Next action: [appointment/follow-up]. Manager involved: [yes/no]."
  },
  {
    title: "Compliance Boundaries",
    tags: ["compliance", "privacy", "pii", "texting", "credit", "approval", "availability"],
    body: "Protect customer information. Do not promise credit approval, exact APR/payment, trade value, incentives, or vehicle availability without proper verification. When in doubt, get a manager.",
    script:
      "I want to give you accurate information, so I am going to verify that with the right manager/system before I promise anything."
  },
  {
    title: "Manager TO Timing",
    tags: ["to", "manager", "turnover", "save", "close"],
    body: "Manager TO should happen before the customer leaves emotionally or physically. Use it when numbers, trade, timing, objections, or confidence become the blocker.",
    script:
      "Before you go, I want my manager to meet you for a minute and make sure we have answered this the right way."
  },
  {
    title: "Delivery Standard",
    tags: ["delivery", "toyota app", "connected services", "bluetooth", "toyotacare", "survey"],
    body: "Delivery should include key feature review, Toyota app/Connected Services, Bluetooth, ToyotaCare, first service, registration/plates explanation, trade item check, and clean follow-up expectations.",
    script:
      "Before you leave, I want to make sure the vehicle is set up around you: phone, app, key features, first service, and any questions."
  },
  {
    title: "Toyota Safety Sense",
    tags: ["tss", "toyota safety sense", "safety", "product"],
    body: "Toyota Safety Sense should be explained in customer-benefit language: it helps support awareness, following distance, lane guidance, and collision mitigation. It assists the driver; it does not replace the driver.",
    script:
      "Toyota Safety Sense is designed to support you in everyday driving. It can help with awareness and driver assistance, but you are always the driver in control."
  },
  {
    title: "Hybrid Explanation",
    tags: ["hybrid", "electrified", "mpg", "battery", "product"],
    body: "Toyota hybrid language should be simple: the system blends gas and electric power automatically. Customers do not plug in a standard hybrid; they just drive it.",
    script:
      "The hybrid system manages itself. You drive it like a normal Toyota, and the vehicle decides when to use gas, electric power, or both."
  }
];

function scoreItem(query: string, item: KnowledgeItem) {
  const q = query.toLowerCase();
  const haystack = `${item.title} ${item.tags.join(" ")} ${item.body}`.toLowerCase();
  let score = 0;
  for (const token of q.split(/[^a-z0-9/]+/).filter(Boolean)) {
    if (haystack.includes(token)) score += token.length > 3 ? 2 : 1;
    if (item.tags.some((tag) => tag.includes(token))) score += 3;
  }
  return score;
}

export function searchTrainingMaterials(query: string) {
  return KNOWLEDGE_BASE
    .map((item) => ({ ...item, score: scoreItem(query, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ score, ...item }) => item);
}

export function fastTrainingAnswer(query: string) {
  const lower = query.toLowerCase();
  const results = searchTrainingMaterials(query);
  if (!results.length) return "";

  const wantsScript = /script|say|respond|reply|text|email|phone|call|voicemail|word/i.test(lower);
  const primary = results[0];
  const related = results.slice(1, 4).map((item) => item.title).join(", ");

  return `Fast Academy Database: ${primary.title}

Direct answer:
${primary.body}

${wantsScript && primary.script ? `Dealership-ready words:\n"${primary.script}"\n` : ""}
Why it matters:
This keeps the response fast, useful, manager-ready, and compliant before Jarvis needs a deeper AI pass.

Related training:
${related || "No related quick hits found."}`;
}

export function generateSalesScript(topic: string) {
  const results = searchTrainingMaterials(topic);
  const item = results[0];
  if (item?.script) {
    return `Fast script: ${item.title}

"${item.script}"

Manager-ready follow-up:
Log the customer need, vehicle, objection, appointment/next action, and whether a manager was involved.`;
  }

  return `Quick ${topic} script:

"I understand. Let me make sure I am helping the right way. What matters most to you about this decision: the vehicle, the timing, the numbers, or the trade?

If we can solve that part together, would it make sense to take the next step today?"`;
}

export function roleplayStarter(scenario: string) {
  const results = searchTrainingMaterials(scenario);
  const topic = results[0]?.title || "Common showroom objection";
  return {
    scenario,
    customerLine:
      topic === "Payment Objection"
        ? "I like it, but I need to be around $500 a month."
        : topic === "Best Price Objection"
          ? "Just give me your best price. I do not want to go back and forth."
          : topic === "Trade Value Boundary"
            ? "Another dealer said my trade is worth more."
            : "I like the vehicle, but I need to think about it and maybe check one more place.",
    coachingTarget:
      "Acknowledge, ask one discovery question, avoid unsupported promises, isolate the real concern, and set a clear next step."
  };
}
