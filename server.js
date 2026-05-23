const http = require("http");
const https = require("https");
const fs = require("fs");
const pathModule = require("path");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOSTNAME || "0.0.0.0";
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const CHAT_API = process.env.TOP_ACADEMY_CHAT_API || "";

const standaloneServer = pathModule.join(__dirname, ".next", "standalone", "server.js");
if (process.env.USE_STATIC_JARVIS !== "true" && fs.existsSync(standaloneServer)) {
  process.env.PORT = String(PORT);
  process.env.HOSTNAME = HOST;
  console.log("Starting Jarvis from Next.js standalone build.");
  require(standaloneServer);
  return;
}

if (process.env.USE_STATIC_JARVIS !== "true") {
  console.warn("Next.js standalone build not found. Starting GoDaddy-safe Jarvis fallback server.");
}

const agents = [
  {
    id: "objection-handler",
    name: "Objection Handler Agent",
    role: "Practices price, payment, trade, spouse, timing, and trust objections."
  },
  {
    id: "product-expert",
    name: "Product Expert Agent",
    role: "Explains Toyota product knowledge in customer-friendly language."
  },
  {
    id: "roleplay-simulator",
    name: "Role-Play Simulator Agent",
    role: "Runs realistic customer conversations for training practice."
  },
  {
    id: "crm-followup",
    name: "CRM & Follow-Up Agent",
    role: "Improves notes, follow-up plans, and appointment-setting language."
  }
];

const jarvisHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Jarvis | Toyota of Portland Training Academy</title>
  <style>
    :root { color-scheme: dark; --red:#eb0a1e; --cyan:#55e6ff; --gold:#f7d26a; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #f8fbff; background: radial-gradient(circle at 20% 10%, rgba(235,10,30,.25), transparent 28%), radial-gradient(circle at 80% 0%, rgba(85,230,255,.18), transparent 32%), #05070d; overflow-x: hidden; }
    body:before { content:""; position: fixed; inset:0; pointer-events:none; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 42px 42px; mask-image: linear-gradient(to bottom, black, transparent 85%); }
    a { color: inherit; }
    .shell { min-height: 100vh; display: grid; grid-template-columns: 300px minmax(0, 1fr); }
    .side { position: sticky; top: 0; height: 100vh; padding: 28px 22px; border-right: 1px solid rgba(255,255,255,.12); background: rgba(8,12,22,.72); backdrop-filter: blur(22px); }
    .brand { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
    .mark { width:46px; height:46px; border-radius:50%; display:grid; place-items:center; background: radial-gradient(circle, var(--red), #7a0008); box-shadow: 0 0 32px rgba(235,10,30,.55); font-weight:900; }
    .brand h1 { margin:0; font-size:18px; letter-spacing:.02em; }
    .brand p { margin:3px 0 0; color:#a9b6c8; font-size:12px; }
    .back { display:block; margin-bottom:18px; padding:11px 13px; border:1px solid rgba(255,255,255,.12); border-radius:14px; text-decoration:none; color:#dbeafe; background:rgba(255,255,255,.06); }
    .panel { border:1px solid rgba(255,255,255,.13); border-radius:22px; background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04)); box-shadow: 0 22px 80px rgba(0,0,0,.35); }
    .quick { padding:14px; }
    .quick h2 { margin:0 0 12px; font-size:13px; color:#fca5a5; text-transform:uppercase; letter-spacing:.13em; }
    .chip { width:100%; margin:6px 0; padding:10px 11px; border:1px solid rgba(85,230,255,.22); border-radius:13px; color:#dff9ff; background:rgba(85,230,255,.07); cursor:pointer; text-align:left; }
    .chip:hover { border-color:rgba(85,230,255,.6); background:rgba(85,230,255,.13); }
    .main { padding: 28px; min-width:0; }
    .hero { display:grid; grid-template-columns:minmax(0,1.1fr) 360px; gap:22px; align-items:stretch; margin-bottom:22px; }
    .headline { padding:28px; position:relative; overflow:hidden; }
    .headline h2 { margin:0; font-size:clamp(34px, 5vw, 72px); line-height:.95; letter-spacing:-.04em; }
    .headline p { max-width:720px; color:#b8c5d8; font-size:16px; line-height:1.7; }
    .status-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:18px; }
    .stat { padding:12px; border-radius:16px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); }
    .stat b { display:block; color:#fff; font-size:19px; }
    .stat span { color:#96a5ba; font-size:12px; }
    .orb-wrap { display:grid; place-items:center; padding:22px; min-height:320px; }
    .orb { width:205px; height:205px; border-radius:50%; position:relative; background:radial-gradient(circle at 50% 45%, rgba(255,255,255,.92), rgba(85,230,255,.65) 11%, rgba(7,35,55,.85) 39%, rgba(235,10,30,.58) 64%, rgba(5,7,13,.4)); box-shadow:0 0 42px rgba(85,230,255,.62), inset 0 0 40px rgba(255,255,255,.22); animation:pulse 2.4s ease-in-out infinite; }
    .orb:before,.orb:after { content:""; position:absolute; inset:-18px; border-radius:50%; border:1px solid rgba(85,230,255,.42); animation:spin 9s linear infinite; }
    .orb:after { inset:-33px; border-color:rgba(235,10,30,.32); animation-duration:13s; animation-direction:reverse; }
    .orb.listening { box-shadow:0 0 70px rgba(235,10,30,.85), inset 0 0 44px rgba(255,255,255,.26); }
    @keyframes pulse { 50% { transform:scale(1.04); } }
    @keyframes spin { to { transform:rotate(360deg); } }
    .workspace { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:22px; }
    .chat { min-height: 610px; display:flex; flex-direction:column; overflow:hidden; }
    .chat-head { padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.12); display:flex; justify-content:space-between; gap:14px; align-items:center; }
    .chat-head h3 { margin:0; font-size:18px; }
    .chat-head small { color:#9fb1c9; }
    .messages { flex:1; overflow:auto; padding:20px; display:flex; flex-direction:column; gap:14px; }
    .msg { max-width:82%; padding:13px 15px; border-radius:18px; white-space:pre-wrap; line-height:1.55; border:1px solid rgba(255,255,255,.11); }
    .assistant { align-self:flex-start; background:rgba(255,255,255,.08); }
    .user { align-self:flex-end; background:linear-gradient(135deg, rgba(235,10,30,.95), rgba(139,0,12,.95)); }
    .input-row { padding:16px; border-top:1px solid rgba(255,255,255,.12); display:flex; gap:10px; align-items:flex-end; }
    textarea { flex:1; min-height:48px; max-height:140px; resize:vertical; border:1px solid rgba(255,255,255,.18); border-radius:16px; background:rgba(0,0,0,.35); color:#fff; padding:13px 14px; font:inherit; outline:none; }
    textarea:focus { border-color:rgba(85,230,255,.8); box-shadow:0 0 0 3px rgba(85,230,255,.14); }
    button { font:inherit; }
    .send,.mic,.ghost { border:0; border-radius:15px; padding:13px 16px; cursor:pointer; color:#fff; font-weight:800; }
    .send { background:var(--red); }
    .mic { width:54px; height:54px; border-radius:50%; background:radial-gradient(circle, var(--cyan), #0f4c81); box-shadow:0 0 25px rgba(85,230,255,.45); }
    .ghost { background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.13); }
    .tools { padding:16px; }
    .tools h3 { margin:0 0 12px; }
    .agent { padding:12px; margin:10px 0; border-radius:16px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); }
    .agent strong { display:block; }
    .agent span { color:#9fb1c9; font-size:13px; line-height:1.45; }
    .footer-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
    .typing { opacity:.75; font-style:italic; }
    @media (max-width: 980px) { .shell { display:block; } .side { position:relative; height:auto; } .hero,.workspace { grid-template-columns:1fr; } .main { padding:18px; } .status-grid { grid-template-columns:1fr; } .msg { max-width:94%; } }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="side">
      <div class="brand"><div class="mark">J</div><div><h1>Jarvis</h1><p>TOP Training Academy AI</p></div></div>
      <a class="back" href="/">Back to Training Academy</a>
      <div class="panel quick">
        <h2>Quick Commands</h2>
        <button class="chip" data-prompt="Start a price objection role-play with me.">Start Role Play</button>
        <button class="chip" data-prompt="Give me a strong internet lead response script.">Lead Response Script</button>
        <button class="chip" data-prompt="Coach me on Toyota product presentation basics.">Product Presentation</button>
        <button class="chip" data-prompt="Help me write a manager-ready CRM note.">CRM Note Coach</button>
        <button class="chip" data-prompt="Quiz me on compliance basics for customer communication.">Compliance Quiz</button>
      </div>
    </aside>

    <main class="main">
      <section class="hero">
        <div class="panel headline">
          <h2>TOP Training Coach<br>Jarvis Console</h2>
          <p>Ask questions, practice customer conversations, build scripts, sharpen objections, and get Toyota of Portland sales coaching without leaving the academy. Calmly powerful, with just enough attitude to keep us honest.</p>
          <div class="status-grid">
            <div class="stat"><b>Live</b><span>Node app at /jarvis</span></div>
            <div class="stat"><b>Voice</b><span>Mic input + spoken replies</span></div>
            <div class="stat"><b>Agents</b><span>Specialized sales trainers</span></div>
          </div>
        </div>
        <div class="panel orb-wrap">
          <div id="orb" class="orb" aria-label="Jarvis status orb"></div>
        </div>
      </section>

      <section class="workspace">
        <div class="panel chat">
          <div class="chat-head">
            <div><h3>Conversation</h3><small>Press Enter to send. Shift + Enter for a new line.</small></div>
            <button class="ghost" id="clearBtn">Clear</button>
          </div>
          <div class="messages" id="messages"></div>
          <div class="input-row">
            <button class="mic" id="micBtn" aria-label="Use voice input">🎙</button>
            <textarea id="input" placeholder="Ask Jarvis about lead handling, objections, CRM notes, product walkarounds, delivery, or manager-ready scripts..."></textarea>
            <button class="send" id="sendBtn">Send</button>
          </div>
        </div>

        <aside class="panel tools">
          <h3>Agent Management</h3>
          <p style="color:#9fb1c9;line-height:1.6;">Jarvis can route training requests to focused coaching agents. Dynamic hosted agents can be connected later; this version includes ready-to-use internal training agents.</p>
          <div id="agents"></div>
          <div class="footer-actions">
            <button class="ghost" id="exportBtn">Export Chat</button>
            <button class="ghost" id="wakeBtn">Hey Jarvis</button>
          </div>
        </aside>
      </section>
    </main>
  </div>

  <script>
    const messagesEl = document.getElementById("messages");
    const inputEl = document.getElementById("input");
    const sendBtn = document.getElementById("sendBtn");
    const micBtn = document.getElementById("micBtn");
    const orb = document.getElementById("orb");
    const agentsEl = document.getElementById("agents");
    let history = JSON.parse(localStorage.getItem("jarvisHistory") || "[]");

    const welcome = "Good evening. I am Jarvis, your Toyota of Portland Training Academy assistant. Ask me for scripts, role-play practice, objection handling, CRM notes, product presentation coaching, or a quick training plan.";

    function save() { localStorage.setItem("jarvisHistory", JSON.stringify(history.slice(-30))); }
    function render() {
      messagesEl.innerHTML = "";
      if (!history.length) addBubble("assistant", welcome, false);
      history.forEach(m => addBubble(m.role, m.content, false));
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function addBubble(role, text, persist = true) {
      const div = document.createElement("div");
      div.className = "msg " + (role === "user" ? "user" : "assistant");
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      if (persist) { history.push({ role, content: text }); save(); }
      return div;
    }
    function speak(text) {
      if (!("speechSynthesis" in window)) return;
      const utter = new SpeechSynthesisUtterance(text.replace(/[*#_]/g, ""));
      const voices = speechSynthesis.getVoices();
      utter.voice = voices.find(v => /Daniel|George|Oliver|UK|British/i.test(v.name + v.lang)) || voices[0];
      utter.rate = 1.02;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
    async function send(text = inputEl.value.trim()) {
      if (!text) return;
      inputEl.value = "";
      addBubble("user", text);
      const thinking = addBubble("assistant", "Jarvis is thinking...", false);
      orb.classList.add("listening");
      sendBtn.disabled = true;
      try {
        const res = await fetch("/jarvis/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history: history.slice(-10) })
        });
        const data = await res.json();
        thinking.remove();
        addBubble("assistant", data.reply || "I am online, but I did not receive a useful answer. Try asking that another way.");
        speak((data.reply || "").slice(0, 500));
      } catch (err) {
        thinking.remove();
        const fallback = localCoach(text);
        addBubble("assistant", fallback);
        speak(fallback.slice(0, 500));
      } finally {
        orb.classList.remove("listening");
        sendBtn.disabled = false;
      }
    }
    function localCoach(text) {
      const t = text.toLowerCase();
      if (t.includes("price") || t.includes("best price")) return "Start by acknowledging the question, then protect accuracy. Example: Absolutely, I can help with pricing. To make sure I am comparing the right vehicle and the right deal, are you looking at this exact stock number, and do you have a trade we should include? Then ask for the appointment. The goal is helpful control, not a race to the lowest number.";
      if (t.includes("lead") || t.includes("internet")) return "For an internet lead: respond fast, confirm the vehicle, answer the question directly, and ask for a specific appointment. Script: Hi, this is Scott at Toyota of Portland. I received your request on the RAV4 and can help. Are you available at 2:15 or 5:15 today to see it and confirm the details together?";
      if (t.includes("crm") || t.includes("note")) return "A manager-ready CRM note should include customer goal, vehicle, objection, next step, and timing. Example: Spoke with Amanda on 2026 RAV4 XLE. Wants AWD, safety tech, and payment near target. Trade possible, payoff unknown. Offered 2:15/5:15 visit; customer prefers after work. Follow up by text at 4:30.";
      if (t.includes("role")) return "Role-play mode: I will be the customer. Customer says: I like the vehicle, but your payment is higher than I wanted. What would you say next? Aim for empathy, discovery, and a next step.";
      return "Here is the practical answer: keep it customer-centered, specific, and manager-ready. Ask one strong discovery question, give a clear next step, and avoid promises on price, payment, credit, availability, or trade value until verified. Please confirm exact store policy with management when the answer depends on a Toyota of Portland rule.";
    }
    async function loadAgents() {
      try {
        const res = await fetch("/jarvis/api/agents");
        const data = await res.json();
        agentsEl.innerHTML = data.agents.map(a => '<div class="agent"><strong>' + a.name + '</strong><span>' + a.role + '</span></div>').join("");
      } catch {
        agentsEl.innerHTML = '<div class="agent"><strong>Core Jarvis</strong><span>Training assistant active. Agent list unavailable.</span></div>';
      }
    }
    sendBtn.addEventListener("click", () => send());
    inputEl.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
    document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => send(b.dataset.prompt)));
    document.getElementById("clearBtn").addEventListener("click", () => { history = []; save(); render(); });
    document.getElementById("exportBtn").addEventListener("click", () => {
      const blob = new Blob([history.map(m => m.role.toUpperCase() + ": " + m.content).join("\\n\\n")], { type: "text/plain" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "jarvis-conversation.txt"; a.click();
    });
    document.getElementById("wakeBtn").addEventListener("click", () => inputEl.focus());
    micBtn.addEventListener("click", () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { addBubble("assistant", "Voice input is not available in this browser. Chrome usually handles it best."); return; }
      const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false;
      orb.classList.add("listening");
      rec.onresult = e => { inputEl.value = e.results[0][0].transcript; send(); };
      rec.onend = () => orb.classList.remove("listening");
      rec.start();
    });
    render(); loadAgents();
  </script>
</body>
</html>`;

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 20000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function postJson(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: target.hostname,
      path: target.pathname + target.search,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body), ...headers }
    }, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data: { raw: data } }); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function localCoach(message) {
  const t = message.toLowerCase();
  if (t.includes("price") || t.includes("payment")) return "Acknowledge, clarify, and move toward verified numbers. Try: I understand. Payment matters. To make this accurate, let us look at the exact vehicle, down payment, term, trade, taxes, and approval together. Are you open to a couple of options if they keep you close to your target?";
  if (t.includes("lead") || t.includes("internet")) return "Strong lead handling is speed plus clarity. Answer the question, confirm the vehicle, and ask for the appointment. Example: I received your request on the RAV4. I can help verify availability and details. Would 2:15 or 5:15 today work better to see it?";
  if (t.includes("objection")) return "Use the framework: agree, isolate, ask, answer, advance. Example: That makes sense. Other than the payment, is the vehicle the right fit? If yes, we can work with the manager to review options.";
  if (t.includes("crm") || t.includes("note")) return "A manager-ready CRM note needs facts: customer goal, vehicle, objection, appointment or follow-up time, and manager involvement. Keep it useful for the next person who opens the record.";
  if (t.includes("role")) return "Role-play started. I am the customer: I like the Toyota, but I want to think about it and maybe shop one more store. What do you say next?";
  return "Here is the best training answer: be specific, helpful, and compliant. Ask a strong question, give a clear next step, document it in CRM, and avoid promises on credit, exact payment, availability, or trade value until verified. Please confirm exact store policy with management when it depends on a local rule.";
}

async function chatReply(message, history) {
  if (CHAT_API && !CHAT_API.includes("/jarvis/api/chat")) {
    try {
      const proxied = await postJson(CHAT_API, { message, history });
      if (proxied.status < 400 && proxied.data && proxied.data.reply) return proxied.data.reply;
    } catch (error) {
      console.warn("Jarvis upstream chat unavailable:", error.message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const input = [
        { role: "system", content: "You are Jarvis, the advanced AI system for Top Training Academy. You are a professional Toyota dealership sales coach and personal assistant. Be confident, concise, motivational, practical, compliant, and slightly witty. If exact Toyota of Portland policy is unknown, say: Please confirm the exact store policy with management." },
        ...history.slice(-10),
        { role: "user", content: message }
      ];
      const result = await postJson("https://api.openai.com/v1/responses", { model: MODEL, input }, {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      });
      if (result.status < 400 && result.data && result.data.output_text) return result.data.output_text;
      console.warn("OpenAI response issue:", result.status);
    } catch (error) {
      console.warn("OpenAI unavailable:", error.message);
    }
  }

  return localCoach(message);
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;

  if (req.method === "GET" && (path === "/" || path === "/jarvis" || path === "/jarvis/")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(jarvisHtml);
    return;
  }

  if (req.method === "GET" && (path === "/api/health" || path === "/jarvis/api/health")) {
    json(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && (path === "/api/agents" || path === "/jarvis/api/agents")) {
    json(res, 200, { agents });
    return;
  }

  if (req.method === "POST" && (path === "/api/chat" || path === "/jarvis/api/chat")) {
    try {
      const body = JSON.parse(await readBody(req) || "{}");
      const message = String(body.message || "").trim();
      const history = Array.isArray(body.history) ? body.history.filter(m => m && typeof m.content === "string").slice(-12) : [];
      if (!message) return json(res, 400, { error: "Message is required." });
      if (message.length > 4000) return json(res, 413, { error: "Message is too long." });
      const reply = await chatReply(message, history);
      json(res, 200, { reply });
    } catch (error) {
      json(res, 500, { error: "Jarvis could not respond right now.", detail: error.message });
    }
    return;
  }

  res.writeHead(302, { Location: "/jarvis" });
  res.end();
});

server.listen(PORT, HOST, () => {
  console.log(`Jarvis ready at http://${HOST}:${PORT}`);
});
