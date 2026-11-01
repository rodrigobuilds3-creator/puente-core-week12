from pathlib import Path
import re
import textwrap
from html import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, Preformatted, KeepTogether
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT/'docs'/'PACKET.md'
OUTPUT = ROOT/'docs'/'PACKET_Rodrigo_Pena_WEEK12.pdf'
BLUE = colors.HexColor('#2257e9'); INK = colors.HexColor('#102753'); MUTED=colors.HexColor('#63738e')

styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='PuTitle',parent=styles['Title'],fontName='Helvetica-Bold',fontSize=23,leading=27,textColor=INK,alignment=0,spaceAfter=13))
styles.add(ParagraphStyle(name='PuHead',parent=styles['Heading2'],fontName='Helvetica-Bold',fontSize=12.5,leading=16,textColor=BLUE,spaceBefore=12,spaceAfter=5,keepWithNext=True))
styles.add(ParagraphStyle(name='PuSub',parent=styles['Heading3'],fontName='Helvetica-Bold',fontSize=10,leading=13,textColor=INK,spaceBefore=9,spaceAfter=4,keepWithNext=True))
styles.add(ParagraphStyle(name='PuBody',parent=styles['BodyText'],fontName='Helvetica',fontSize=9,leading=13,textColor=INK,spaceAfter=7))
styles.add(ParagraphStyle(name='PuSmall',parent=styles['BodyText'],fontName='Helvetica',fontSize=7.5,leading=10,textColor=INK))
styles.add(ParagraphStyle(name='PuCode',fontName='Courier',fontSize=6.8,leading=8.7,textColor=INK,leftIndent=7,backColor=colors.HexColor('#eff3ff'),spaceBefore=5,spaceAfter=9))
styles.add(ParagraphStyle(name='PuCaption',parent=styles['BodyText'],fontSize=8,leading=11,textColor=MUTED,alignment=TA_CENTER,spaceAfter=8))

def plain(s):
    return s.replace('–','-').replace('—','-').replace('−','-').replace('→','->').replace('≥','>=').replace('×','x').replace('’',"'").replace('“','"').replace('”','"')

def fmt(s):
    s=escape(plain(s)); s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s); s=re.sub(r'\*(.+?)\*',r'<i>\1</i>',s); s=re.sub(r'`(.+?)`',r'<font name="Courier">\1</font>',s)
    s=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',r'<link href="\2" color="#2257e9">\1</link>',s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'\1',s)
    return s

story=[]; lines=SOURCE.read_text().splitlines(); i=0

def diagram(kind):
    draw=Drawing(500,145 if kind=='flow' else 130)
    def box(x,y,w,h,label,fill='#eef3ff'):
        draw.add(Rect(x,y,w,h,rx=4,ry=4,fillColor=colors.HexColor(fill),strokeColor=colors.HexColor('#b8c9ec')))
        for n,part in enumerate(label.split('\n')):
            draw.add(String(x+7,y+h-15-11*n,part,fontName='Helvetica',fontSize=8,fillColor=INK))
    def arrow(x1,y1,x2,y2):
        draw.add(Line(x1,y1,x2,y2,strokeColor=BLUE,strokeWidth=1.1))
        draw.add(Polygon([x2,y2,x2-5,y2+2.5,x2-5,y2-2.5],fillColor=BLUE,strokeColor=BLUE))
    if kind=='flow':
        for x,label in [(0,'Cash and\nhousehold floor'),(125,'Five to seven\ndaily records'),(250,'Floor plus\npositive reserve'),(375,'Cash bridge\nand route terms')]: box(x,88,108,39,label)
        for x in (108,233,358): arrow(x,107,x+17,107)
        box(0,17,152,40,'Incomplete inputs\nExplain what is missing','#fff5d3')
        box(174,17,152,40,'Negative margin\nUnavailable + fallback','#ffeae5')
        box(348,17,152,40,'Evidence review\nProvisional or reviewable','#e5f4eb')
        draw.add(String(5,69,'Result depends on data completeness, cash margin and route evidence.',fontName='Helvetica',fontSize=8,fillColor=MUTED))
    else:
        for y,label in [(88,'PERSON'),(48,'PUENTE'),(8,'ROUTE OWNER')]:
            draw.add(String(0,y+14,label,fontName='Helvetica-Bold',fontSize=8,fillColor=BLUE))
            draw.add(Line(88,y+4,500,y+4,strokeColor=colors.HexColor('#dce5f5')))
        box(100,88,125,30,'Enter and correct')
        box(245,88,125,30,'Review and decide')
        box(100,48,125,30,'Validate and calculate')
        box(245,48,125,30,'Explain state and action')
        box(100,8,270,30,'Provide dated terms; no automatic handoff','#fff5d3')
    return draw

while i<len(lines):
    line=lines[i].strip()
    if not line: i+=1; continue
    if line.startswith('```'):
        block=[]; i+=1
        while i<len(lines) and not lines[i].strip().startswith('```'):
            block.extend(textwrap.wrap(plain(lines[i]),width=94,replace_whitespace=False,drop_whitespace=False) or [''])
            i+=1
        if block and block[0].strip().startswith('flowchart'):
            story.append(diagram('flow' if 'TD' in block[0] else 'actors'))
            story.append(Paragraph('The editable Mermaid source is in PACKET.md.',styles['PuCaption']))
        else:
            story.append(Preformatted('\n'.join(block),styles['PuCode']))
        i+=1; continue
    if line.startswith('!['):
        match=re.search(r'\]\(([^)]+)\)',line)
        if match:
            f=SOURCE.parent/match.group(1)
            if f.exists():
                image=Image(str(f)); image._restrictSize(4.1*inch,4.5*inch); image.hAlign='CENTER'; story.extend([Spacer(1,4),image,Paragraph('Generated concept with fictional data',styles['PuCaption'])])
        i+=1; continue
    if line.startswith('# '): story.append(Paragraph(fmt(line[2:]),styles['PuTitle'])); i+=1; continue
    if line.startswith('## '): story.append(Paragraph(fmt(line[3:]),styles['PuHead'])); i+=1; continue
    if line.startswith('### '): story.append(Paragraph(fmt(line[4:]),styles['PuSub'])); i+=1; continue
    if line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            vals=[x.strip() for x in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'[:\- ]+',v or ' ') for v in vals): rows.append(vals)
            i+=1
        if rows:
            count=max(map(len,rows)); width=(7.1*inch)/count
            cooked=[[Paragraph(fmt(v),styles['PuSmall']) for v in row]+['']*(count-len(row)) for row in rows]
            tab=Table(cooked,colWidths=[width]*count,repeatRows=1,hAlign='LEFT')
            tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9effe')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f5f7fb')]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
            story.extend([tab,Spacer(1,7)])
        continue
    if re.match(r'^[-*] |^\d+\. ',line):
        story.append(Paragraph(fmt(line),styles['PuBody'])); i+=1; continue
    text=[line]; i+=1
    while i<len(lines) and lines[i].strip() and not re.match(r'^(#|\||```|!\[|[-*] |\d+\. )',lines[i].strip()):
        text.append(lines[i].strip()); i+=1
    story.append(Paragraph(fmt(' '.join(text)),styles['PuBody']))

def footer(canvas, doc):
    canvas.saveState(); canvas.setFont('Helvetica',7); canvas.setFillColor(MUTED)
    canvas.drawString(.65*inch,.38*inch,'PUENTE  /  WEEK 12  /  SYNTHETIC PROTOTYPE'); canvas.drawRightString(7.85*inch,.38*inch,str(doc.page)); canvas.restoreState()

doc=SimpleDocTemplate(str(OUTPUT),pagesize=letter,rightMargin=.7*inch,leftMargin=.7*inch,topMargin=.65*inch,bottomMargin=.6*inch,title='PUENTE Week 12 Product Packet',author='Rodrigo Peña de León Pérez')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUTPUT)
