import os, re, threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request

BASE = "https://shaders.com"
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "_nuxt")
os.makedirs(OUT, exist_ok=True)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

nuxt_re = re.compile(r'/_nuxt/[A-Za-z0-9._/-]+')
rel_re = re.compile(r'\./([A-Za-z0-9._/-]+\.js)')

have = set(os.listdir(OUT))
seen = set()
queue = []
lock = threading.Lock()

def add_ref(ref):
    if ref not in seen:
        seen.add(ref)
        with lock:
            queue.append(ref)

# seed from index.html
with open(os.path.join(ROOT, "index.html"), encoding="utf-8", errors="ignore") as f:
    txt = f.read()
for m in nuxt_re.findall(txt):
    add_ref(m)
for m in rel_re.findall(txt):
    add_ref("/_nuxt/" + os.path.basename(m))

def scan_file(path):
    try:
        data = open(path, "rb").read()
        txt = data.decode("utf-8", errors="ignore")
    except Exception:
        return
    for m in nuxt_re.findall(txt):
        add_ref(m)
    for m in rel_re.findall(txt):
        add_ref("/_nuxt/" + os.path.basename(m))

for fn in os.listdir(OUT):
    scan_file(os.path.join(OUT, fn))

print("seed refs:", len(seen))

ok = 0
fail = []
def dl(ref):
    global ok
    name = os.path.basename(ref)
    url = BASE + ref
    dest = os.path.join(OUT, name)
    if name in have and os.path.exists(dest) and os.path.getsize(dest) > 0:
        with lock:
            ok += 1
        return
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(dest, "wb") as w:
            w.write(data)
        have.add(name)
        with lock:
            ok += 1
        txt = data.decode("utf-8", errors="ignore")
        for m in nuxt_re.findall(txt):
            add_ref(m)
        for m in rel_re.findall(txt):
            add_ref("/_nuxt/" + os.path.basename(m))
    except Exception as e:
        with lock:
            fail.append((ref, str(e)))

rounds = 0
while queue:
    batch = []
    with lock:
        batch, queue = queue, []
    if not batch:
        break
    rounds += 1
    with ThreadPoolExecutor(max_workers=16) as ex:
        list(ex.map(dl, batch))
    print(f"round {rounds}: processed {len(batch)}, queue now {len(queue)}, ok={ok}, fail={len(fail)}")

print("DONE ok=%d fail=%d" % (ok, len(fail)))
for r, e in fail[:40]:
    print("FAIL", r, e)
