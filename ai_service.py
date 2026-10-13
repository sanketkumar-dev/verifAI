# AI ka kaam: Gemini se baat karna aur jawab ko result mein badalna
import os, re, json, time, base64, requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
RESULTS = ["Likely Reliable", "Needs Verification", "Likely Misleading"]


def ask_gemini(parts, use_search=True):
    """Gemini ko request bhejta hai. Busy ya connection toote to 3 baar dobara try."""
    key = os.getenv("GEMINI_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    body = {"contents": [{"parts": parts}]}
    if use_search:
        body["tools"] = [{"google_search": {}}]         # web search bhi karega
    response = None
    for attempt in range(3):
        try:
            response = requests.post(url, params={"key": key}, json=body, timeout=120)
            if response.status_code != 503:
                break
        except requests.exceptions.RequestException:
            if attempt == 2:
                raise RuntimeError("Internet ya Google se connection toot gaya. Dobara try karo.")
        time.sleep(3)
    if response.status_code == 429 and use_search:      # limit poori: bina search ke try
        return ask_gemini(parts, use_search=False)
    if response.status_code == 429:
        raise RuntimeError("Google ki free limit abhi poori hai. 1 minute ruk ke dobara try karo.")
    if not response.ok:
        raise RuntimeError(f"Gemini error {response.status_code}")
    data = response.json()["candidates"][0]
    text = "".join(p.get("text", "") for p in data["content"]["parts"])
    chunks = data.get("groundingMetadata", {}).get("groundingChunks", [])
    sources = [{"name": c["web"].get("title", ""), "url": c["web"]["uri"]} for c in chunks if "web" in c][:6]
    return text, sources


def get_page_text(url):
    """Link ke page se text nikalna."""
    html = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15).text
    html = re.sub(r"(?is)<(script|style).*?</\1>", " ", html)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()[:4000]


def build_prompt(text, kind, language, has_file):
    """Gemini ko kya karna hai, ye likhta hai."""
    start = f"You are VerifAI. Today is {datetime.now():%d %b %Y}. Never claim 100% certainty.\n"
    if kind == "Email":
        task = ("Check if this EMAIL is spam or phishing. Look for: fake or mismatched sender, urgency or threats, "
                "requests for OTP/password/bank details, suspicious links, prizes or money offers, bad spelling. "
                "Use 'Likely Misleading' for likely spam/phishing, 'Needs Verification' for suspicious, 'Likely Reliable' for looks safe. "
                "In 'details' list the red flags. You cannot see the real sender, so say it is an estimate and not to click links.\n")
        if has_file:
            task += "Read the attached image as an email screenshot and check its visible text for spam or phishing signs.\n"
    else:
        task = ("Fact-check this content. For real-world claims search the web and prefer OFFICIAL websites. "
                "If nothing official is found say so, but a claim that sounds like a nationwide or sweeping shutdown "
                "with no official notice should be 'Likely Misleading'. Use 'Needs Verification' only when really unsure.\n")
    if has_file and kind in ("Image", "Video"):
        task += ("Read the text/speech in the file. Judge if it is AI-generated or edited (odd hands/faces, warping background, "
                 "rubbery motion). Give a high ai_likelihood if several signs are present.\n")
    return (start + task + f"CONTENT:\n{text or '(see attached file)'}\n"
            f'Reply ONLY JSON, text in {language}: {{"result": one of {RESULTS}, "confidence": 0-100, '
            '"reason": "2-3 simple sentences", "details": "short key findings", "ai_likelihood": 0-100 (photo/video only, else 0)}')


def check_content(text, lang, kind, file_bytes=None, mime=None):
    """Content jaanch ke result, confidence, reason deta hai."""
    language = "Hindi" if lang == "hi" else "English"
    parts = [{"text": build_prompt(text, kind, language, bool(file_bytes))}]
    if file_bytes:
        parts.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(file_bytes).decode()}})
    answer, sources = ask_gemini(parts)
    data = json.loads(re.search(r"\{.*\}", answer, re.S).group(0))
    if data.get("result") not in RESULTS:
        data["result"] = "Needs Verification"
    data["confidence"] = max(0, min(100, int(data.get("confidence", 50))))
    if kind in ("Image", "Video"):                      # photo/video: AI ke nishaan ke hisaab se
        likely = int(data.get("ai_likelihood", 0) or 0)
        if likely >= 65:
            data["result"], data["confidence"] = "Likely Misleading", likely
        elif data["result"] == "Likely Reliable":
            data["result"] = "Needs Verification"
    data["sources"] = sources
    return data


def chat_answer(report, question, lang):
    """Result ke baad user ke sawal ka jawab."""
    language = "Hindi" if lang == "hi" else "English"
    prompt = (f"Content: {report['content'][:1500]}\nVerdict: {report['result']} ({report['confidence']}%)\nReason: {report['reason']}\n"
              f"User question: {question[:500]}\nAnswer briefly in {language}, simple words. Do not claim certainty.")
    return ask_gemini([{"text": prompt}])[0]
