import os, sys, threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request

BASE = "https://shaders.com"
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "_nuxt")
os.makedirs(OUT, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

with open(os.path.join(ROOT, "nuxt_refs.txt")) as f:
    refs = [l.strip() for l in f if l.strip()]

lock = threading.Lock()
ok = 0
fail = []

def dl(ref):
    global ok
    name = os.path.basename(ref)
    url = BASE + ref
    dest = os.path.join(OUT, name)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        with lock:
            ok += 1
        return
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
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

print(f"OK={ok} FAIL={len(fail)} total={len(refs)}")
for r, e in fail:
    print("FAIL", r, e)
