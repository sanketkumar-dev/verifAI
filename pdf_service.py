# PDF report aur QR code banana
import io, os
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT = "Helvetica"                                      # Hindi ke liye Windows ka Nirmala font
if os.path.exists("C:/Windows/Fonts/Nirmala.ttf"):
    pdfmetrics.registerFont(TTFont("Hindi", "C:/Windows/Fonts/Nirmala.ttf"))
    FONT = "Hindi"

COLORS = {"Likely Reliable": (.18, .75, .44), "Needs Verification": (.94, .66, .17), "Likely Misleading": (.94, .36, .36)}


def make_pdf(r, link):
    qr = io.BytesIO()
    qrcode.make(link).save(qr, "PNG")                   # link ka QR code
    qr.seek(0)
    out = io.BytesIO()
    c = canvas.Canvas(out, pagesize=A4)
    w, h = A4

    # Upar ki neeli patti
    c.setFillColorRGB(.11, .14, .25); c.rect(0, h - 100, w, 100, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 28); c.drawString(40, h - 55, "VerifAI")
    c.setFont("Helvetica", 11); c.drawString(40, h - 75, "Verification Report | Share karne se pehle, sach jaanch lo")

    # Result ka rang wala box
    c.setFillColorRGB(*COLORS[r["result"]]); c.roundRect(40, h - 180, w - 80, 54, 12, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 22)
    c.drawString(58, h - 160, r["result"].upper()); c.drawRightString(w - 58, h - 160, f"{r['confidence']}%")

    # ID, type, date
    y = h - 215
    for label, value in [("Verification ID", r["id"]), ("Content type", r["kind"]), ("Date", r["created"])]:
        c.setFillColorRGB(.35, .42, .55); c.setFont("Helvetica-Bold", 10); c.drawString(40, y, label.upper())
        c.setFillColorRGB(0, 0, 0); c.setFont("Helvetica", 11); c.drawString(150, y, value); y -= 18

    def write(title, body):                             # heading + paragraph likhna
        nonlocal y
        y -= 10; c.setFont("Helvetica-Bold", 12); c.setFillColorRGB(.1, .13, .28); c.drawString(40, y, title); y -= 16
        c.setFont(FONT, 10.5); c.setFillColorRGB(0, 0, 0)
        for line in simpleSplit(body or "-", FONT, 10.5, w - 260):
            c.drawString(40, y, line); y -= 14

    write("Summary", r["reason"])
    write("Sources", "\n".join(f"{s['name']}: {s['url'][:70]}" for s in r["sources"]) or "No existing source found; AI analysis only.")

    # QR code aur neeche ki line
    c.drawImage(ImageReader(qr), w - 190, 70, 140, 140)
    c.setFont("Helvetica-Bold", 9); c.setFillColorRGB(.35, .42, .55); c.drawCentredString(w - 120, 58, "SCAN TO VERIFY THIS REPORT")
    c.setFont("Helvetica", 8.5); c.drawString(40, 36, "AI-assisted verification. Not a 100% guarantee of real or fake.")
    c.save()
    out.seek(0)
    return out
