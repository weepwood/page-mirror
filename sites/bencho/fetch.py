import os, re, urllib.request, ssl
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://bencho.dev"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
ROOT = os.path.dirname(os.path.abspath(__file__))
ctx = ssl.create_default_context()

def local_path(rel):
    return ROOT + rel

def fetch(rel):
    p = local_path(rel)
    if os.path.exists(p) and os.path.getsize(p) > 0:
        return None
    os.makedirs(os.path.dirname(p), exist_ok=True)
    req = urllib.request.Request(BASE + rel, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ctx) as r:
            data = r.read()
    except Exception as e:
        print(f"  FAIL {rel}: {e}")
        return None
    with open(p, "wb") as f:
        f.write(data)
    return rel

JS_REF = re.compile(r'["\']((?:/)?assets/[A-Za-z0-9._\-]+\.js)["\']')
JS_REL = re.compile(r'["\'](\./[A-Za-z0-9._\-]+\.js)["\']')
CSS_URL = re.compile(r'url\(\s*["\']?((?:/)?assets/[A-Za-z0-9._\-]+\.(?:css|woff2|woff|ttf|otf))["\']?\s*\)')
FONT_URL = re.compile(r'url\(\s*["\']?(/[A-Za-z0-9._\-/]+\.(?:woff2|woff|ttf|otf))["\']?\s*\)')
STATIC = re.compile(r'["\'](/[A-Za-z0-9._\-/]+\.(?:svg|jpg|jpeg|png|js))["\']')

with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
    html = f.read()

queue = []
for m in re.findall(r'(?:src|href)="((?:/)?assets/[A-Za-z0-9._\-]+\.(?:js|css))"', html):
    queue.append(m if m.startswith("/") else "/" + m)
for s in ["/favicon.ico", "/favicon-192.png", "/apple-touch-icon.png", "/share-cover-ring.png"]:
    queue.append(s)

seen = set()
pending = list(queue)
total_done = 0

while pending:
    batch = []
    while pending and len(batch) < 16:
        rel = pending.pop(0)
        if rel in seen:
            continue
        seen.add(rel)
        batch.append(rel)
    if not batch:
        break
    def work(rel):
        res = fetch(rel)
        if res is None:
            return []
        p = local_path(rel)
        txt = open(p, "rb").read().decode("utf-8", errors="ignore")
        is_js = rel.endswith(".js")
        is_css = rel.endswith(".css")
        refs = []
        if is_js:
            for r in JS_REF.findall(txt):
                refs.append(r if r.startswith("/") else "/" + r)
            for r in JS_REL.findall(txt):
                d = os.path.dirname(rel)
                refs.append((d + "/" + r[2:]).replace("\\", "/"))
            for r in STATIC.findall(txt):
                refs.append(r)
            for r in re.findall(r'import\(\s*`\./([A-Za-z0-9._\-]+\.js)`', txt):
                d = os.path.dirname(rel)
                refs.append((d + "/" + r).replace("\\", "/"))
        elif is_css:
            for r in CSS_URL.findall(txt):
                refs.append(r if r.startswith("/") else "/" + r)
            for r in FONT_URL.findall(txt):
                refs.append(r)
        return refs
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(work, r): r for r in batch}
        for f in as_completed(futs):
            refs = f.result() or []
            for r in refs:
                if r.startswith("/") and r not in seen and r not in pending:
                    pending.append(r)
    total_done += len(batch)
    print(f"processed {total_done}, queue depth {len(pending)}", flush=True)

print("DONE total unique:", len(seen))
