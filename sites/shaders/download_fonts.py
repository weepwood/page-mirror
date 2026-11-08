import os, re, threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request

BASE = "https://shaders.com"
ROOT = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

# collect refs from all css + js
refs = set()
pat_font = re.compile(r'\.\./_fonts/([A-Za-z0-9._/-]+\.woff2)')
pat_svg = re.compile(r'url\(\.\./([A-Za-z0-9._/-]+\.svg)\)')
for folder in ("_nuxt",):
    for fn in os.listdir(os.path.join(ROOT, folder)):
        p = os.path.join(ROOT, folder, fn)
        if not (fn.endswith(".css") or fn.endswith(".js")):
            continue
        try:
            txt = open(p, encoding="utf-8", errors="ignore").read()
        except Exception:
            continue
        for m in pat_font.findall(txt):
            refs.add("/_fonts/" + m)
        for m in pat_svg.findall(txt):
            # ../X.svg relative to /_nuxt/ -> /X.svg at root
            refs.add("/" + m)

print("font/svg refs found:", len(refs))

os.makedirs(os.path.join(ROOT, "_fonts"), exist_ok=True)
lock = threading.Lock()
ok = 0
fail = []
def dl(ref):
    global ok
    dest = os.path.join(ROOT, ref.lstrip("/"))
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        with lock:
            ok += 1
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(BASE + ref, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(dest, "wb") as w:
            w.write(data)
        with lock:
            ok += 1
    except Exception as e:
        with lock:
            fail.append((ref, str(e)))

with ThreadPoolExecutor(max_workers=16) as ex:
    list(ex.map(dl, refs))

print("OK=%d FAIL=%d" % (ok, len(fail)))
for r, e in fail[:30]:
    print("FAIL", r, e)
