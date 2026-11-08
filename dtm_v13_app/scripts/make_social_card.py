"""Genera img/social_card.jpg (1200x630) per dtm_v13_app: mosaico tile z12 (rilievo + Δ quota) + testo."""
import math, os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Z = 12
W, H = 1200, 630
def tx(lon): return (lon + 180) / 360 * 2**Z
def ty(lat):
    r = math.radians(lat); return (1 - math.asinh(math.tan(r)) / math.pi) / 2 * 2**Z
x0, x1 = tx(13.24134), tx(13.45471); y0, y1 = ty(38.22538), ty(38.04842)
cw, ch = int((x1 - x0) * 256) + 1, int((y1 - y0) * 256) + 1
def mosaic(name):
    m = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    for x in range(int(x0), int(x1) + 1):
        for y in range(int(y0), int(y1) + 1):
            p = f"{ROOT}/tiles/{name}/{Z}/{x}/{2**Z - 1 - y}.png"  # TMS
            if os.path.exists(p):
                m.alpha_composite(Image.open(p).convert("RGBA"), (int((x - x0) * 256), int((y - y0) * 256)))
    return m
NAVY=(10,16,36,255)
def font(n,sz): return ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf"%n, sz)
terr = mosaic("rilievo_v13"); diff = mosaic("diff_quota")
# mappa: rilievo scurito + differenze sature
from PIL import ImageEnhance, ImageFilter, ImageChops
r,g,b,a = terr.split(); dark = ImageEnhance.Brightness(Image.merge("RGB",(r,g,b))).enhance(0.55)
terr = Image.merge("RGBA",(*dark.split(),a))
m = Image.new("RGBA",(cw,ch),(0,0,0,0)); m.alpha_composite(terr); m.alpha_composite(diff)
r,g,b,a = m.split(); m = Image.merge("RGBA",(*ImageEnhance.Color(Image.merge("RGB",(r,g,b))).enhance(1.9).split(),a))
sc = H*1.18/ch; m = m.resize((int(cw*sc),int(ch*sc)),Image.LANCZOS)
card = Image.new("RGBA",(W,H),NAVY)
# bagliore radiale dietro la mappa
glow = Image.new("RGBA",(W,H),(0,0,0,0)); gd = ImageDraw.Draw(glow)
gd.ellipse((560,-120,1300,760),fill=(255,110,50,55)); gd.ellipse((420,200,900,700),fill=(40,120,255,60))
card.alpha_composite(glow.filter(ImageFilter.GaussianBlur(110)))
# griglia a punti
dots = ImageDraw.Draw(card)
for x in range(20,W,36):
    for y in range(20,H,36): dots.ellipse((x-1,y-1,x+1,y+1),fill=(255,255,255,26))
# ombra + mappa
mx,my = W-m.width+110,(H-m.height)//2+6
sh = Image.new("RGBA",(W,H),(0,0,0,0)); sh.paste((0,0,0,170),(mx,my),m.split()[3]); card.alpha_composite(sh.filter(ImageFilter.GaussianBlur(18)))
card.alpha_composite(m,(mx,my))
# velo a sinistra per il testo
ov = Image.new("RGBA",(W,H),(0,0,0,0)); od = ImageDraw.Draw(ov)
for x in range(760): od.line([(x,0),(x,H)],fill=(10,16,36,int(235*min(1,(760-x)/330))))
card.alpha_composite(ov)
d = ImageDraw.Draw(card)
# banda colori (scala differenze)
for i,c in enumerate([(33,102,172),(103,169,207),(209,229,240),(253,219,199),(239,138,98),(178,24,43)]): d.rectangle((60+i*46,52,60+i*46+46,58),fill=c)
d.text((60,74),"PALERMO HUB · HR-DTM-5m",font=font("Bold",23),fill=(255,150,95))
d.text((60,122),"Cosa cambia",font=font("Bold",84),fill=(255,255,255))
d.text((60,208),"tra v1.1",font=font("Bold",84),fill=(255,255,255))
d.text((60,294),"e v1.3",font=font("Bold",84),fill=(255,150,95))
for i,t in enumerate(["Il DTM di Palermo a 5 metri:","differenze di quota, pendenza","e fonti del dato."]): d.text((60,400+i*32),t,font=font("Regular",25),fill=(190,200,225))
def chip(x,big,small,w=170):
    o=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(o).rounded_rectangle((x,512,x+w,578),14,fill=(255,255,255,24),outline=(255,255,255,70),width=1); card.alpha_composite(o)
    d=ImageDraw.Draw(card)
    d.text((x+14,514),big,font=font("Bold",28),fill=(255,255,255)); d.text((x+14,553),small,font=font("Regular",16),fill=(170,182,212))
chip(60,"6,4 M","celle confrontate",168); chip(240,"+165/−84 m","variazione quota",190); chip(442,"24 %","celle oltre ±0,5 m",172)
d.text((60,596),"OpenDataSicilia.it  ·  mappa interattiva su dati aperti",font=font("Bold",18),fill=(150,164,200))
# logo OpenDataSicilia (esagono) in alto a destra, con ombra
logo = Image.open(f"{ROOT}/img/opendatasicilia.png").convert("RGBA"); lh = 150
logo = logo.resize((int(logo.width*lh/logo.height), lh), Image.LANCZOS)
lx, ly = W-logo.width-44, 40
sh = Image.new("RGBA",(W,H),(0,0,0,0)); sh.paste((0,0,0,150),(lx,ly+4),logo.split()[3]); card.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
card.alpha_composite(logo,(lx,ly))
card.convert("RGB").save(f"{ROOT}/img/social_card.jpg",quality=90)
print("ok")
