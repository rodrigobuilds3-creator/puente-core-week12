from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs'/'BUILDCHAT_SESSION_SNAPSHOT.md'
OUTPUT=ROOT/'docs'/'BUILDCHAT_PUENTE_SESSION_SNAPSHOT.pdf'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleP',fontName='Helvetica-Bold',fontSize=18,leading=22,textColor=colors.HexColor('#102753'),spaceAfter=12))
styles.add(ParagraphStyle(name='WhoP',fontName='Helvetica-Bold',fontSize=9,leading=12,textColor=colors.HexColor('#2257e9'),spaceBefore=10,spaceAfter=4,keepWithNext=True))
styles.add(ParagraphStyle(name='TextP',fontName='Helvetica',fontSize=9,leading=13,textColor=colors.HexColor('#102753'),spaceAfter=7,wordWrap='CJK'))

story=[]
for chunk in SOURCE.read_text().split('\n\n'):
    t=chunk.strip()
    if not t: continue
    if t.startswith('# '):
        story.append(Paragraph(escape(t[2:]),styles['TitleP']))
    elif t.startswith('## '):
        story.append(Paragraph(escape(t[3:]),styles['WhoP']))
    else:
        t=t.replace('’',"'").replace('–','-').replace('—','-')
        story.append(Paragraph(escape(t).replace('\n','<br/>'),styles['TextP']))

def footer(canvas,doc):
    canvas.saveState();canvas.setFont('Helvetica',7);canvas.setFillColor(colors.HexColor('#63738e'))
    canvas.drawString(.7*inch,.38*inch,'PUENTE  /  VISIBLE CONVERSATION SNAPSHOT');canvas.drawRightString(7.8*inch,.38*inch,str(doc.page));canvas.restoreState()

doc=SimpleDocTemplate(str(OUTPUT),pagesize=letter,leftMargin=.7*inch,rightMargin=.7*inch,topMargin=.65*inch,bottomMargin=.6*inch,title='PUENTE BuildChat session snapshot')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUTPUT)
