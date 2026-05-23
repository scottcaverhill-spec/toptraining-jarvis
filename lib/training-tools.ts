type KnowledgeItem = {
  title: string;
  tags: string[];
  body: string;
  script?: string;
};

type QaItem = {
  question: string;
  aliases?: string[];
  answer: string;
  category: string;
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

const QA_BANK: QaItem[] = [
  {
    question: "What is the 20/3 rule?",
    aliases: ["explain 20/3", "daily contacts", "daily proposals", "activity standard"],
    category: "Daily Activity",
    answer:
      "Toyota of Portland's 20/3 rule means each salesperson should make 20 meaningful contacts and create 3 proposals each day. A meaningful contact should move the customer forward: appointment, follow-up, revived lead, proposal, or next step."
  },
  {
    question: "What should I say when a customer asks for the best price?",
    aliases: ["best price", "lowest price", "what is your best deal", "discount"],
    category: "Objection Handling",
    answer:
      "Acknowledge the question, then make sure you are pricing the right vehicle and deal structure. Say: \"I will gladly help with pricing. To compare this the right way, are you looking at this exact trim and equipment, and do you have a trade or financing involved?\""
  },
  {
    question: "How do I answer an out-the-door price request?",
    aliases: ["out the door", "otd", "complete price", "tax and license"],
    category: "Pricing",
    answer:
      "Do not guess. Explain that an accurate out-the-door figure depends on ZIP code, taxes, registration, vehicle, trade, and approved incentives. Say: \"I can help with a complete figure. To make it accurate, what ZIP code should I use, and will there be a trade?\""
  },
  {
    question: "What should I say when a customer asks about monthly payment?",
    aliases: ["payment", "monthly payment", "$500 a month", "apr", "rate"],
    category: "Finance",
    answer:
      "Do not promise payment, APR, rate, or approval. Say: \"Payment depends on the vehicle, down payment, term, taxes, trade, and approved finance options. Are you trying to stay under a certain monthly range?\""
  },
  {
    question: "What should I say when a customer has credit concerns?",
    aliases: ["bad credit", "credit not perfect", "credit approval", "pre approval"],
    category: "Finance",
    answer:
      "Stay calm and do not promise approval. Say: \"We work with customers in many different situations. The best step is to review the facts and see what options are available. Would you prefer to start that conversation when you arrive or complete a secure application ahead of time?\""
  },
  {
    question: "How should I handle a trade value question over the phone?",
    aliases: ["trade value", "what is my trade worth", "appraisal", "trade-in"],
    category: "Trade",
    answer:
      "Do not promise trade value before appraisal. Say: \"I can give general guidance, but a real value depends on condition, mileage, equipment, and current market demand. The quickest accurate answer is a live appraisal. Can you bring it with you?\""
  },
  {
    question: "What do I say about negative equity?",
    aliases: ["negative equity", "upside down", "payoff more than value"],
    category: "Trade",
    answer:
      "Do not guess or minimize it. Say: \"That is common. The best thing we can do is evaluate the trade accurately, confirm the payoff, and show you the real options. Guessing usually creates confusion.\""
  },
  {
    question: "What makes a CRM note manager-ready?",
    aliases: ["crm note", "manager ready note", "focus note", "bad note"],
    category: "CRM",
    answer:
      "A manager-ready note includes lead source, customer need, vehicle, objection/question, next action, appointment status, and whether a manager was involved. It should be factual, concise, and useful to the next person."
  },
  {
    question: "What should I put in a lead response note?",
    aliases: ["lead note", "internet note", "website lead note", "follow-up note"],
    category: "CRM",
    answer:
      "Use this structure: Lead source, vehicle, customer request, response sent/call made, appointment offered, customer reply, next task, and manager involvement if any."
  },
  {
    question: "How fast should I respond to a lead?",
    aliases: ["lead response time", "internet lead speed", "new lead timing"],
    category: "Lead Handling",
    answer:
      "Respond as quickly as possible. The first response should acknowledge the request, reference the vehicle, ask one useful question, and offer two appointment times. Speed matters, but quality still matters."
  },
  {
    question: "How should I greet a showroom customer?",
    aliases: ["customer greeting", "meet and greet", "up greeting", "first impression"],
    category: "Greeting",
    answer:
      "Use a confident, low-pressure greeting. Say: \"Welcome to Toyota of Portland, I am [Name]. What brought you in today?\" Then listen before jumping into inventory."
  },
  {
    question: "How do I ask for the appointment?",
    aliases: ["appointment", "set appointment", "two times", "come in today"],
    category: "Appointment Setting",
    answer:
      "Offer two clear choices. Say: \"The vehicle sounds like a strong fit. I have 2:15 or 5:15 available today. Which works better for you?\""
  },
  {
    question: "What do I say if the customer says they might stop by?",
    aliases: ["might stop by", "come in whenever", "no appointment"],
    category: "Appointment Setting",
    answer:
      "Keep it helpful, not pushy. Say: \"You are welcome to do that. The reason I recommend a time is so the vehicle and the right person are ready for you. What time do you think you will most likely arrive?\""
  },
  {
    question: "When should I get a manager involved?",
    aliases: ["manager to", "turnover", "manager introduction", "save deal"],
    category: "Manager TO",
    answer:
      "Get a manager involved before the customer leaves emotionally or physically. Use a TO for price, payment, trade, timing, confidence, or any unresolved objection."
  },
  {
    question: "What should I never promise a customer?",
    aliases: ["compliance", "do not promise", "credit promise", "availability promise", "trade promise"],
    category: "Compliance",
    answer:
      "Do not promise credit approval, exact APR, exact payment, trade value, incentives, or vehicle availability without proper verification. When in doubt, verify with the right manager or system."
  },
  {
    question: "What are the texting and privacy basics?",
    aliases: ["texting consent", "privacy", "pii", "customer information", "personal text"],
    category: "Compliance",
    answer:
      "Protect customer information. Use approved CRM/store communication tools, follow consent rules, avoid sending private customer data through personal channels, and keep messages professional and factual."
  },
  {
    question: "How do I explain Toyota Safety Sense?",
    aliases: ["tss", "safety sense", "pre collision", "lane tracing", "adaptive cruise"],
    category: "Product Knowledge",
    answer:
      "Explain Toyota Safety Sense as driver assistance in customer-benefit language. It can help support awareness, following distance, lane guidance, and collision mitigation, but the driver remains responsible and in control."
  },
  {
    question: "How do I explain Toyota hybrid vehicles?",
    aliases: ["hybrid", "electrified", "battery", "mpg", "plug in"],
    category: "Product Knowledge",
    answer:
      "A Toyota hybrid automatically blends gas and electric power. A standard hybrid does not need to be plugged in; the customer drives it like a normal Toyota while the system manages efficiency."
  },
  {
    question: "What should be covered during delivery?",
    aliases: ["delivery", "toyota app", "connected services", "bluetooth", "toyotacare", "first service"],
    category: "Delivery",
    answer:
      "Delivery should include key feature review, Toyota app/Connected Services, Bluetooth, ToyotaCare, first service appointment, registration/plates explanation, trade item check, and a clear follow-up expectation."
  },
  {
    question: "What should I say when a customer says they need to think about it?",
    aliases: ["need to think", "think about it", "not ready", "sleep on it"],
    category: "Objection Handling",
    answer:
      "Acknowledge and isolate. Say: \"I understand. Usually when someone says that, there is one part they are still unsure about. Is it the vehicle, the numbers, or the timing?\""
  },
  {
    question: "What should I say when a customer says another dealer is cheaper?",
    aliases: ["another dealer cheaper", "dealer cheaper", "lower quote", "competitor"],
    category: "Objection Handling",
    answer:
      "Do not attack the other dealer. Say: \"I am glad you are comparing carefully. Before you drive across town, let us make sure it is the same vehicle, equipment, and total structure. Do you have the stock number or quote?\""
  },
  {
    question: "What should I say if a customer is just looking?",
    aliases: ["just looking", "only looking", "not buying today"],
    category: "Greeting",
    answer:
      "Keep it easy. Say: \"Perfect, most people start there. My job is just to help you narrow things down. What type of vehicle are you looking at?\""
  },
  {
    question: "What should I say if a customer needs to talk to their spouse?",
    aliases: ["talk to spouse", "wife", "husband", "partner decision"],
    category: "Objection Handling",
    answer:
      "Respect it and create a next step. Say: \"Of course, that makes sense. Would it help if we scheduled a time when both of you can see it together?\""
  },
  {
    question: "How do I handle a missed appointment?",
    aliases: ["missed appointment", "no show", "reschedule"],
    category: "Follow-Up",
    answer:
      "Stay helpful. Say: \"Hi [First Name], this is [Name] at Toyota of Portland. I had you scheduled for [Time] to see the [Vehicle] and wanted to make sure everything is okay. Would later today or tomorrow work better?\""
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

function scoreQa(query: string, item: QaItem) {
  const q = query.toLowerCase().trim();
  const haystack = `${item.question} ${(item.aliases || []).join(" ")} ${item.category} ${item.answer}`.toLowerCase();
  let score = 0;
  if (haystack.includes(q)) score += 25;
  if (item.question.toLowerCase().includes(q) || q.includes(item.question.toLowerCase())) score += 30;
  for (const alias of item.aliases || []) {
    const cleanAlias = alias.toLowerCase();
    if (q.includes(cleanAlias) || cleanAlias.includes(q)) score += 20;
  }
  for (const token of q.split(/[^a-z0-9/]+/).filter(Boolean)) {
    if (haystack.includes(token)) score += token.length > 3 ? 3 : 1;
  }
  return score;
}

export function findQuickAnswer(query: string) {
  const matches = QA_BANK
    .map((item) => ({ ...item, score: scoreQa(query, item) }))
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!matches.length) return "";
  const [primary, ...related] = matches;
  return `Fast Q&A Database: ${primary.question}

Category:
${primary.category}

Answer:
${primary.answer}

Related quick answers:
${related.map((item) => item.question).join("\n") || "No closely related Q&A found."}`;
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
  const quickAnswer = findQuickAnswer(query);
  if (quickAnswer) return quickAnswer;

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
