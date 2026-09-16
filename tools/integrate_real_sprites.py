from pathlib import Path
from PIL import Image
import shutil, re, json

BASE = Path(__file__).resolve().parents[1]
MANIFEST = [
  {
    "id": "scrapGenerator",
    "dest": "assets/images/sprites/defenders/scrap-generator.webp",
    "src": "/mnt/data/sprite_sheet_de_gerador_sci_fi_em_colapso.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.07
  },
  {
    "id": "boltCannon",
    "dest": "assets/images/sprites/defenders/bolt-cannon.webp",
    "src": "/mnt/data/sprite_sheet_de_torreta_mecânica_sci_fi.png",
    "cols": 5,
    "rows": 4,
    "anchor": "ground",
    "margin": 0.06
  },
  {
    "id": "tireWall",
    "dest": "assets/images/sprites/defenders/tire-wall.webp",
    "src": "/mnt/data/sprite_sheet_de_barricada_industrial_animada.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.05
  },
  {
    "id": "dualTower",
    "dest": "assets/images/sprites/defenders/dual-tower.webp",
    "src": "/mnt/data/sprite_turret_ciclo_de_combate.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.06
  },
  {
    "id": "industrialFreezer",
    "dest": "assets/images/sprites/defenders/industrial-freezer.webp",
    "src": "/mnt/data/sprite_sheet_da_torreta_criogênica.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.06
  },
  {
    "id": "teslaCoil",
    "dest": "assets/images/sprites/defenders/tesla-coil.webp",
    "src": "/mnt/data/sprite_de_torre_tesla_steampunk.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.05
  },
  {
    "id": "hydraulicPress",
    "dest": "assets/images/sprites/defenders/hydraulic-press.webp",
    "src": "/mnt/data/folha_de_sprites_de_prensa_hidráulica_industrial.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.06
  },
  {
    "id": "oilLauncher",
    "dest": "assets/images/sprites/defenders/oil-launcher.webp",
    "src": "/mnt/data/sprite_de_canhão_de_óleo_industrial.png",
    "cols": 4,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.06
  },
  {
    "id": "riftbornScout",
    "dest": "assets/images/sprites/enemies/riftborn-scout.webp",
    "src": "/mnt/data/sprite_sheet_de_criatura_alienígena_sci_fi.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.08
  },
  {
    "id": "riftbornShield",
    "dest": "assets/images/sprites/enemies/riftborn-shield.webp",
    "src": "/mnt/data/sprite_de_alien_blindado_com_escudo.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.08
  },
  {
    "id": "riftbornRunner",
    "dest": "assets/images/sprites/enemies/riftborn-runner.webp",
    "src": "/mnt/data/sprite_sheet_de_criatura_alienígena.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.09
  },
  {
    "id": "riftbornBrute",
    "dest": "assets/images/sprites/enemies/riftborn-brute.webp",
    "src": "/mnt/data/folha_de_sprites_do_brute_alienígena.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.09
  },
  {
    "id": "riftbornFlyer",
    "dest": "assets/images/sprites/enemies/riftborn-flyer.webp",
    "src": "/mnt/data/spritesheet_do_riftborn_flyer.png",
    "cols": 6,
    "rows": 3,
    "anchor": "center",
    "margin": 0.06
  },
  {
    "id": "riftbornTechnician",
    "dest": "assets/images/sprites/enemies/riftborn-technician.webp",
    "src": "/mnt/data/folha_de_sprites_do_sabotador_alienígena.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.08
  },
  {
    "id": "riftbornCommander",
    "dest": "assets/images/sprites/enemies/riftborn-commander.webp",
    "src": "/mnt/data/planilha_de_sprites_do_comandante_riftborn.png",
    "cols": 6,
    "rows": 3,
    "anchor": "ground",
    "margin": 0.08
  },
  {
    "id": "ironcladColossus",
    "dest": "assets/images/sprites/bosses/ironclad-colossus.webp",
    "src": "/mnt/data/spritesheet_de_colosso_mecânico_em_combate.png",
    "cols": 8,
    "rows": 5,
    "anchor": "ground",
    "margin": 0.05
  },
  {
    "id": "shadeStalkerPrime",
    "dest": "assets/images/sprites/bosses/shade-stalker-prime.webp",
    "src": "/mnt/data/folha_de_sprites_do_assassino_do_vazio.png",
    "cols": 7,
    "rows": 4,
    "anchor": "ground",
    "margin": 0.07
  },
  {
    "id": "riftbornOverlord",
    "dest": "assets/images/sprites/bosses/riftborn-overlord.webp",
    "src": "/mnt/data/sprite_sheet_do_titã_mecânico_eldritch.png",
    "cols": 10,
    "rows": 5,
    "anchor": "ground",
    "margin": 0.04
  }
]

def clean_alpha(img):
    img=img.convert('RGBA')
    px=img.load(); w,h=img.size
    for y in range(h):
        for x in range(w):
            r,g,b,a=px[x,y]
            if a <= 12:
                px[x,y]=(0,0,0,0)
            elif a < 36 and (r+g+b) < 60:
                px[x,y]=(0,0,0,0)
    return img

def cut_cell(src, cols, rows, c, r):
    left=round(c*src.width/cols); right=round((c+1)*src.width/cols)
    top=round(r*src.height/rows); bottom=round((r+1)*src.height/rows)
    return src.crop((left, top, right, bottom))

def alpha_bbox(im, threshold=8):
    a=im.getchannel('A').point(lambda p: 255 if p>threshold else 0)
    return a.getbbox()

def fit_cell(cell, fw, fh, anchor='ground', margin=0.08):
    cell=clean_alpha(cell)
    bbox=alpha_bbox(cell)
    if not bbox:
        return Image.new('RGBA',(fw,fh),(0,0,0,0)), None
    trimmed=cell.crop(bbox)
    maxw=int(fw*(1-2*margin)); maxh=int(fh*(1-2*margin))
    scale=min(maxw/trimmed.width, maxh/trimmed.height)
    nw=max(1, round(trimmed.width*scale)); nh=max(1, round(trimmed.height*scale))
    resized=trimmed.resize((nw,nh), Image.LANCZOS)
    canvas=Image.new('RGBA',(fw,fh),(0,0,0,0))
    x=(fw-nw)//2
    if anchor=='center': y=(fh-nh)//2
    elif anchor=='top': y=max(0, int(fh*margin))
    else: y=fh-nh-int(fh*margin*0.65)
    canvas.alpha_composite(resized, (x,y))
    return canvas, bbox



def flip_sheet_per_frame(img, fw, fh):
    cols = img.width // fw
    rows = img.height // fh
    out = Image.new('RGBA', img.size, (0,0,0,0))
    for r in range(rows):
        for c in range(cols):
            cell = img.crop((c*fw, r*fh, (c+1)*fw, (r+1)*fh)).transpose(Image.FLIP_LEFT_RIGHT)
            out.alpha_composite(cell, (c*fw, r*fh))
    return out

def main():
    cfg_text=(BASE/'data'/'sprites.js').read_text(encoding='utf-8')
    dims={}
    for item in MANIFEST:
        aid=item['id']
        idx=cfg_text.find(aid+':')
        chunk=cfg_text[idx: cfg_text.find('\n  },', idx)+6] if '\n  },' in cfg_text[idx:] else cfg_text[idx: cfg_text.find('\n  },', idx)]
        m=re.search(r'frameWidth:\s*(\d+),\s*frameHeight:\s*(\d+)', cfg_text[idx: idx+400])
        dims[aid]=(int(m.group(1)), int(m.group(2)))
    for item in MANIFEST:
        fw,fh=dims[item['id']]
        src=Image.open(Path(item['src'])).convert('RGBA')
        sheet=Image.new('RGBA', (item['cols']*fw, item['rows']*fh), (0,0,0,0))
        for r in range(item['rows']):
            for c in range(item['cols']):
                raw=cut_cell(src, item['cols'], item['rows'], c, r)
                fitted,_=fit_cell(raw, fw, fh, item['anchor'], item['margin'])
                sheet.alpha_composite(fitted, (c*fw, r*fh))
        dest=BASE/item['dest']
        dest.parent.mkdir(parents=True, exist_ok=True)
        
        if '/sprites/enemies/' in item['dest'] or '/sprites/bosses/' in item['dest']:
            sheet = flip_sheet_per_frame(sheet, fw, fh)
        sheet.save(dest, 'WEBP', lossless=True, method=6)
        print('built', item['id'], '->', dest)

if __name__ == '__main__':
    main()
