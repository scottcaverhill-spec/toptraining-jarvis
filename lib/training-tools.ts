export function searchTrainingMaterials(query: string) {
  const q = query.toLowerCase();
  const snippets = [
    {
      title: "20/3 Rule",
      body: "Toyota of Portland expects consistent daily activity: 20 meaningful contacts and 3 proposals."
    },
    {
      title: "Objection Handling",
      body: "A strong response acknowledges, asks a clarifying question, isolates the real issue, and creates a next step."
    },
    {
      title: "CRM Notes",
      body: "A manager-ready note should include customer need, vehicle, objection, next action, appointment status, and manager involvement."
    },
    {
      title: "Compliance Boundaries",
      body: "Do not promise credit approval, exact APR/payment, trade value, incentives, or availability without proper verification."
    },
    {
      title: "Delivery",
      body: "Delivery should include feature review, Toyota app/Connected Services, Bluetooth, ToyotaCare, first service, and follow-up expectations."
    }
  ];
  return snippets.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(q)).slice(0, 5);
}

export function generateSalesScript(topic: string) {
  return `Quick ${topic} script:

"I understand. Let me make sure I am helping the right way. What matters most to you about this decision: the vehicle, the timing, the numbers, or the trade?

If we can solve that part together, would it make sense to take the next step today?"`;
}

export function roleplayStarter(scenario: string) {
  return {
    scenario,
    customerLine: "I like the vehicle, but I need to think about it and maybe check one more place.",
    coachingTarget: "Acknowledge, isolate the concern, ask what they need to think through, and set a clear next step."
  };
}
