import os, re, threading
from concurrent.futures import ThreadPoolExecutor
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://shaders.com"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

nuxt_re = re.compile(r'/_nuxt/[A-Za-z0-9._/-]+')
rel_re = re.compile(r'\./([A-Za-z0-9._/-]+\.(?:js|css))')
img_re = re.compile(r'/(images|testimonials|og|videos|media)/([A-Za-z0-9._/-]+\.(?:jpg|jpeg|png|webp|svg|gif|mp4|webm))')
build_re = re.compile(r'/_nuxt/builds/([A-Za-z0-9._/-]+)')

# Collect all source text
texts = []
texts.append(open(os.path.join(ROOT, "index.html"), encoding="utf-8", errors="ignore").read())
for fn in os.listdir(os.path.join(ROOT, "_nuxt")):
    if fn.endswith((".js", ".css")):
        texts.append(open(os.path.join(ROOT, "_nuxt", fn), encoding="utf-8", errors="ignore").read())

refs = {}  # local_rel_path -> full_url_path
for t in texts:
    for m in nuxt_re.findall(t):
        refs["_nuxt/" + os.path.basename(m)] = m
    for m in rel_re.findall(t):
        refs["_nuxt/" + os.path.basename(m)] = "/_nuxt/" + os.path.basename(m)
    for m in img_re.findall(t):
        full = "/" + m[0] + "/" + m[1]
        refs[full.lstrip("/")] = full
    for m in build_re.findall(t):
        full = "/_nuxt/builds/" + m
        refs["_nuxt/builds/" + m] = full

print("total candidate local refs:", len(refs))

lock = threading.Lock()
ok = 0
skip = 0
fail = []
def dl(rel, urlpath):
    global ok, skip
    dest = os.path.join(ROOT, rel)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        with lock:
            skip += 1
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(ORIGIN + urlpath, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(dest, "wb") as w:
            w.write(data)
        with lock:
            ok += 1
    except Exception as e:
        with lock:
            fail.append((rel, str(e)))

with ThreadPoolExecutor(max_workers=16) as ex:
    list(ex.map(lambda kv: dl(kv[0], kv[1]), refs.items()))

print("downloaded_new=%d skipped=%d fail=%d" % (ok, skip, len(fail)))
for r, e in fail[:40]:
    print("FAIL", r, e)
