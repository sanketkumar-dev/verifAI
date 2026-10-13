// VerifAI - page ke buttons ka kaam. Har hissa alag section mein hai.

// ===== 1. Hindi / English text =====
var TEXT = {
  en: { nav_home: "Home", nav_how: "How it works", nav_history: "History", nav_about: "About",
    title: "Check before you share", sub: "Verify news, messages, emails, links, documents, photos and short videos.",
    tab_text: "Text / Link", tab_file: "Photo / Video", placeholder: "Paste a message, news or link here...",
    file_help: "Choose a photo or a short video (10-15 sec, up to 14 MB)", verify: "Check", wait: "Checking, please wait...",
    sources: "Sources and evidence", disclaimer: "AI-assisted verification.",
    pdf: "Download report (PDF)", copy: "Copy public link", copied: "Link copied!", chat_title: "Ask more about this result",
    chat_placeholder: "Example: Why is this misleading?", send: "Send", confidence: "Confidence", empty: "No checks yet.",
    s1: "1. Add content", s1t: "Paste a message or link, or upload a photo / short video.",
    s2: "2. AI checks", s2t: "VerifAI searches official sources on the web and analyses the claim.",
    s3: "3. Get the verdict", s3t: "See the result, confidence, reasons and sources.",
    s4: "4. Save the proof", s4t: "Download a PDF with a QR code that anyone can scan to verify the report.",
    about_text: "VerifAI helps students, families and small-town users check news, messages, photos and videos before sharing. We never claim 100% real or fake.",
    tagline: "Share karne se pehle, sach jaanch lo", official: "Official",
    logout: "Logout", content_type: "Content Type", type_auto: "Auto Detect", type_news: "News/Message",
    type_link: "Website Link", type_email: "Email/Spam Check", document_title: "Document Upload",
    document_help: "PDF, TXT, DOCX, JPG, JPEG or PNG (up to 10 MB)", analyze_document: "Analyze document",
    email_help: "Paste the email text, or upload a screenshot of it.", email_placeholder: "Paste the email here...",
    email_results: { "Likely Reliable": "Looks safe", "Needs Verification": "Suspicious", "Likely Misleading": "Likely spam / phishing" },
    results: { "Likely Reliable": "Likely Reliable", "Needs Verification": "Needs Verification", "Likely Misleading": "Likely Misleading" } },
  hi: { nav_home: "होम", nav_how: "कैसे काम करता है", nav_history: "इतिहास", nav_about: "हमारे बारे में",
    title: "शेयर करने से पहले जाँचें", sub: "खबर, मैसेज, ईमेल, लिंक, दस्तावेज़, फोटो और छोटे वीडियो जाँचें।",
    tab_text: "टेक्स्ट / लिंक", tab_file: "फोटो / वीडियो", placeholder: "यहाँ मैसेज, खबर या लिंक पेस्ट करें...",
    file_help: "फोटो या छोटा वीडियो चुनें (10-15 सेकंड, 14 MB तक)", verify: "जाँचें", wait: "जाँच हो रही है, कृपया रुकें...",
    sources: "सोर्स और सबूत", disclaimer: "AI-assisted verification.",
    pdf: "रिपोर्ट डाउनलोड (PDF)", copy: "पब्लिक लिंक कॉपी करें", copied: "लिंक कॉपी हो गया!", chat_title: "इस नतीजे के बारे में और पूछें",
    chat_placeholder: "उदाहरण: ये भ्रामक क्यों है?", send: "भेजें", confidence: "भरोसा", empty: "अभी कोई जाँच नहीं हुई।",
    s1: "1. कंटेंट डालें", s1t: "मैसेज या लिंक पेस्ट करें, या फोटो / छोटा वीडियो चुनें।",
    s2: "2. AI जाँच करता है", s2t: "VerifAI वेब पर आधिकारिक सोर्स खोजकर दावे की जाँच करता है।",
    s3: "3. नतीजा पाएँ", s3t: "नतीजा, भरोसा, कारण और सोर्स देखें।",
    s4: "4. सबूत सुरक्षित रखें", s4t: "QR कोड वाली PDF डाउनलोड करें, जिसे कोई भी स्कैन करके रिपोर्ट जाँच सकता है।",
    about_text: "VerifAI छात्रों, परिवारों और छोटे शहरों के लोगों को शेयर करने से पहले खबर, मैसेज, फोटो और वीडियो जाँचने में मदद करता है। हम कभी 100% सही या गलत का दावा नहीं करते।",
    tagline: "शेयर करने से पहले, सच जाँचें", official: "आधिकारिक",
    logout: "लॉगआउट", content_type: "कंटेंट का प्रकार", type_auto: "अपने आप पहचानें", type_news: "खबर/मैसेज",
    type_link: "वेबसाइट लिंक", type_email: "ईमेल/स्पैम जाँच", document_title: "दस्तावेज़ अपलोड",
    document_help: "PDF, TXT, DOCX, JPG, JPEG या PNG (10 MB तक)", analyze_document: "दस्तावेज़ जाँचें",
    email_help: "ईमेल का टेक्स्ट पेस्ट करें, या उसका स्क्रीनशॉट चुनें।", email_placeholder: "यहाँ ईमेल पेस्ट करें...",
    email_results: { "Likely Reliable": "सुरक्षित लगता है", "Needs Verification": "संदिग्ध", "Likely Misleading": "संभवतः स्पैम / फ़िशिंग" },
    results: { "Likely Reliable": "संभवतः भरोसेमंद", "Needs Verification": "जाँच ज़रूरी", "Likely Misleading": "संभवतः भ्रामक" } }
};
var lang = localStorage.getItem("lang") || "en";
var currentId = null;   // abhi kaunsi report khuli hai

function t(key) { return TEXT[lang][key]; }

function applyLanguage() {
  document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.dataset.t); });
  document.querySelectorAll("[data-ph]").forEach(function (el) { el.placeholder = t(el.dataset.ph); });
  document.getElementById("lang-btn").textContent = lang === "en" ? "हिंदी" : "English";
}

// ===== 2. Chhote helper =====
function $(id) { return document.getElementById(id); }

function makeEl(tag, className, text) {
  var el = document.createElement(tag);
  if (className) { el.className = className; }
  if (text) { el.textContent = text; }   // textContent se safe rehta hai
  return el;
}

var COLORS = { "Likely Reliable": "#1f9d55", "Needs Verification": "#b87500", "Likely Misleading": "#d33b3b" };

// ===== 3. Tabs (text / file) =====
var mode = "text";   // abhi kaunsa tab khula hai

function showTab(name) {
  mode = name;
  $("text-box").hidden = name !== "text";
  $("file-box").hidden = name !== "file";
  $("tab-text").className = name === "text" ? "active" : "";
  $("tab-file").className = name === "file" ? "active" : "";
}
$("tab-text").onclick = function () { showTab("text"); };
$("tab-file").onclick = function () { showTab("file"); };

function labelFor(r) {   // Email ke liye alag naam, baaki ke liye normal
  return r.kind === "Email" ? t("email_results")[r.result] : t("results")[r.result];
}

// ===== 4. Result dikhana =====
function showReport(r) {
  currentId = r.id;
  var color = COLORS[r.result];
  $("badge").textContent = labelFor(r);
  $("badge").style.background = color;
  $("report-id").textContent = "ID: " + r.id;
  $("gauge").style.setProperty("--value", r.confidence);
  $("gauge").style.setProperty("--color", color);
  $("gauge-text").textContent = r.confidence + "%";
  $("meta").textContent = t("confidence") + " | " + r.kind + " | " + r.created;
  $("reason").textContent = r.reason;
  $("details").textContent = r.details;
  $("pdf-link").href = "/api/report/" + r.id + "/pdf";

  var box = $("sources");
  box.innerHTML = "";
  r.sources.forEach(function (s) {
    var div = makeEl("div", "source");
    div.appendChild(makeEl("b", "", s.name || "Source"));
    if (/\.gov\.in|\.nic\.in|sbi\.co\.in|rbi\.org\.in|irctc|pib\.gov/.test(s.name + s.url)) {
      div.appendChild(makeEl("span", "tag", t("official")));
    }
    div.appendChild(document.createElement("br"));
    var a = makeEl("a", "muted", s.url.slice(0, 80));
    a.href = s.url; a.target = "_blank"; a.rel = "noopener";
    div.appendChild(a);
    box.appendChild(div);
  });

  $("messages").innerHTML = "";
  $("result").hidden = false;
  $("result").scrollIntoView();
}

// ===== 5. Check button =====
$("verify-btn").onclick = async function () {
  var data = new FormData();
  data.append("lang", lang);
  data.append("mode", "text");
  data.append("content_type", $("content-type").value);
  data.append("text", $("text").value);
  runVerification(data, $("verify-btn"));
};
$("verify-btn-file").onclick = function () {
  var data = new FormData();
  data.append("lang", lang);
  data.append("mode", "file");
  if ($("file").files[0]) { data.append("file", $("file").files[0]); }
  runVerification(data, $("verify-btn-file"));
};
$("document-file").onchange = function () {
  $("document-name").textContent = this.files[0] ? this.files[0].name : "";
};
$("document-btn").onclick = function () {
  var data = new FormData();
  data.append("lang", lang);
  data.append("mode", "document");
  data.append("content_type", $("content-type").value);
  if ($("document-file").files[0]) { data.append("file", $("document-file").files[0]); }
  runVerification(data, $("document-btn"));
};

async function runVerification(data, button) {
  $("error").hidden = true;
  $("status").textContent = t("wait");
  button.disabled = true;
  try {
    var response = await fetch("/api/verify", { method: "POST", body: data });
    var json = await response.json();
    if (json.error) { throw new Error(json.error); }
    showReport(json);
    loadHistory();
  } catch (e) {
    $("error").textContent = "Error: " + e.message;
    $("error").hidden = false;
  }
  $("status").textContent = "";
  button.disabled = false;
}

// ===== 6. Chat =====
function addMessage(who, text) {
  var div = makeEl("div", "message " + who, text);
  $("messages").appendChild(div);
  return div;
}
async function sendQuestion() {
  var question = $("question").value.trim();
  if (!question || !currentId) { return; }
  $("question").value = "";
  addMessage("me", question);
  var waiting = addMessage("ai", "...");
  try {
    var response = await fetch("/api/chat/" + currentId, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: question, lang: lang })
    });
    waiting.textContent = (await response.json()).answer;
  } catch (e) { waiting.textContent = "Error: jawab nahi mila"; }
}
$("send-btn").onclick = sendQuestion;
$("question").onkeydown = function (e) { if (e.key === "Enter") { sendQuestion(); } };

// ===== 7. Public link copy =====
$("copy-btn").onclick = function () {
  var link = location.origin + "/?id=" + currentId;
  navigator.clipboard.writeText(link);
  $("copy-btn").textContent = t("copied");
  setTimeout(function () { $("copy-btn").textContent = t("copy"); }, 2000);
};

// ===== 8. History =====
async function loadHistory() {
  var list = $("history-list");
  var response = await fetch("/api/history");
  if (!response.ok) { return; }   // login nahi hai to history nahi
  var rows = await response.json();
  list.innerHTML = "";
  if (!rows.length) { list.appendChild(makeEl("p", "muted", t("empty"))); }
  rows.forEach(function (r) {
    var row = makeEl("div", "row");
    row.appendChild(makeEl("span", "", labelFor(r) + " (" + r.confidence + "%) - " + r.content.slice(0, 70)));
    row.appendChild(makeEl("span", "muted", r.created));
    row.onclick = function () { showReport(r); };
    list.appendChild(row);
  });
}

// ===== 9. Bhasha badalna =====
$("lang-btn").onclick = function () {
  lang = lang === "en" ? "hi" : "en";
  localStorage.setItem("lang", lang);
  applyLanguage();
  loadHistory();
};

// ===== 10. Logout =====
$("logout-btn").onclick = async function () {
  await fetch("/api/logout", { method: "POST" });
  location.assign("/login");
};

// ===== 11. Page khulte hi =====
applyLanguage();
var shared = new URLSearchParams(location.search).get("id");   // QR scan ya link: /?id=ABC123

// Link wali report dikhana. Jo report ka maalik nahi hai use sirf report dikhti hai.
function showSharedReport(id, loggedIn) {
  fetch("/api/report/" + id).then(function (r) { return r.json(); }).then(function (r) {
    if (r.error) { return; }
    showReport(r);
    if (!r.is_owner) {
      $("pdf-link").hidden = true;
      $("copy-btn").hidden = true;
      $("messages").hidden = true;
      $("question").parentElement.hidden = true;
    }
    if (!loggedIn) {
      $("verify").hidden = true;
      $("history").hidden = true;
    }
  });
}

fetch("/api/me").then(function (r) { return r.json(); }).then(function (me) {
  $("user-email").textContent = me.email || "";
  if (me.email) { loadHistory(); }
  if (shared) {
    showSharedReport(shared, !!me.email);
  } else if (!me.email) {
    location.assign("/login");   // login nahi hai to login page par bhejo
  }
});
