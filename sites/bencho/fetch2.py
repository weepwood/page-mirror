import os, re, urllib.request, ssl
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://bencho.dev"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
ROOT = os.path.dirname(os.path.abspath(__file__))
ctx = ssl.create_default_context()

JS_REF = re.compile(r'["\']((?:/)?assets/[A-Za-z0-9._\-]+\.js)["\']')
JS_REL = re.compile(r'["\'](\./[A-Za-z0-9._\-]+\.js)["\']')
CSS_URL = re.compile(r'url\(\s*["\']?((?:/)?assets/[A-Za-z0-9._\-]+\.(?:css|woff2|woff|ttf|otf))["\']?\s*\)')
FONT_URL = re.compile(r'url\(\s*["\']?(/[A-Za-z0-9._\-/]+\.(?:woff2|woff|ttf|otf))["\']?\s*\)')
STATIC = re.compile(r'["\'](/[A-Za-z0-9._\-/]+\.(?:svg|jpg|jpeg|png|gif|js))["\']')
TPL = re.compile(r'import\(\s*`\./([A-Za-z0-9._\-]+\.js)`')

def refs_in(path):
    try:
        txt = open(path, "rb").read().decode("utf-8", errors="ignore")
    except Exception:
        return []
    is_js = path.endswith(".js")
    is_css = path.endswith(".css")
    out = []
    if is_js:
        for r in JS_REF.findall(txt):
            out.append(r if r.startswith("/") else "/" + r)
        for r in JS_REL.findall(txt):
            d = os.path.dirname("/" + os.path.relpath(path, ROOT).replace("\\", "/"))
            out.append((d + "/" + r[2:]).replace("\\", "/"))
        for r in STATIC.findall(txt):
            out.append(r)
        for r in TPL.findall(txt):
            d = os.path.dirname("/" + os.path.relpath(path, ROOT).replace("\\", "/"))
            out.append((d + "/" + r).replace("\\", "/"))
    elif is_css:
        for r in CSS_URL.findall(txt):
            out.append(r if r.startswith("/") else "/" + r)
        for r in FONT_URL.findall(txt):
            out.append(r)
    return out

def fetch(rel):
    p = os.path.join(ROOT, rel.lstrip("/"))
    if os.path.exists(p) and os.path.getsize(p) > 0:
        return False
    os.makedirs(os.path.dirname(p), exist_ok=True)
    req = urllib.request.Request(BASE + rel, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
            data = r.read()
    except Exception as e:
        print(f"  FAIL {rel}: {e}")
        return False
    with open(p, "wb") as f:
        f.write(data)
    return True

def all_local():
    res = []
    for dp, _, fns in os.walk(ROOT):
        for fn in fns:
            if fn.endswith((".js", ".css", ".html")):
                res.append(os.path.join(dp, fn))
    return res

round_n = 0
while True:
    round_n += 1
    discovered = set()
    for f in all_local():
        for r in refs_in(f):
            if r.startswith("/"):
                discovered.add(r)
    missing = [r for r in discovered if not (os.path.exists(os.path.join(ROOT, r.lstrip("/"))) and os.path.getsize(os.path.join(ROOT, r.lstrip("/"))) > 0)]
    print(f"Round {round_n}: discovered {len(discovered)} refs, missing {len(missing)}", flush=True)
    if not missing:
        break
    def work(rel):
        return fetch(rel)
    with ThreadPoolExecutor(max_workers=10) as ex:
        list(ex.map(work, missing))
    # safety cap
    if round_n > 30:
        print("CAP reached")
        break

print("STABLE. Final asset file count:", len([1 for _ in all_local() if _.endswith(('.js','.css'))]))
