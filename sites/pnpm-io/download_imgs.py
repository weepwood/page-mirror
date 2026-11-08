import os, sys, time, urllib.request, urllib.error

BASE = "https://pnpm.io"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
ROOT = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(ROOT, "img_list.txt"), encoding="utf-8") as f:
    paths = [l.strip() for l in f if l.strip()]

def local_path(p):
    return os.path.join(ROOT, p.lstrip("/"))

def fetch(p):
    url = BASE + p
    out = local_path(p)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    last = None
    for attempt in range(1, 8):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            if not data:
                raise ValueError("empty body")
            with open(out, "wb") as w:
                w.write(data)
            return True
        except Exception as e:
            last = e
            time.sleep(1.5)
    print(f"FAIL {p}: {last}")
    return False

done = 0
ok = 0
for p in paths:
    fpath = local_path(p)
    if os.path.exists(fpath) and os.path.getsize(fpath) > 0:
        done += 1
        continue
    if fetch(p):
        ok += 1
    time.sleep(0.3)

print(f"already present: {done}, newly downloaded: {ok}")
