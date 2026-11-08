#!/usr/bin/env python3
import os, re, hashlib, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
ASSET_EXT = ('.js','.css','.png','.jpg','.jpeg','.gif','.svg','.ico','.woff','.woff2','.ttf','.json','.webp')
MIRROR = os.path.join(ROOT, '_m')

def url_hash(url):
    return hashlib.sha1(url.encode('utf-8')).hexdigest()[:16]

def local_path_for(url):
    # determine extension
    path = url.split('?')[0].split('#')[0]
    ext = ''
    for e in ASSET_EXT:
        if path.lower().endswith(e):
            ext = e
            break
    if not ext:
        # bundles like /xjs/_/js/k=... -> .js ; /og/_/js/k -> .js ; /og/_/ss/k -> .css
        if '/_/js/' in url: ext='.js'
        elif '/_/ss/' in url: ext='.css'
        else: ext='.bin'
    h = url_hash(url)
    return os.path.join('_m', h + ext), '/_m/' + h + ext

def should_localize(url):
    low = url.lower()
    # only assets on google/gstatic family
    if 'gstatic.com' not in low and 'google.com' not in low and 'googleapis.com' not in low:
        return False
    if any(low.endswith(e) for e in ASSET_EXT):
        return True
    if '/_/js/' in url or '/_/ss/' in url:
        return True
    return False

def curl(url, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    cmd = ['curl','-sSL','--fail','--max-time','60','-A',UA,'-o',out_path,url]
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 0

def extract_urls(text):
    urls = set()
    # scheme-relative //host/path
    for m in re.finditer(r'(?<![:/])//([a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/[^\s"\'()`<>]+)', text):
        urls.add('https://' + m.group(1))
    # absolute https://
    for m in re.finditer(r'https://([a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/[^\s"\'()`<>]+)', text):
        urls.add('https://' + m.group(1))
    # root-relative /path  (not scheme-relative //) -> resolve to google.com
    for m in re.finditer(r'(?<![:/\w])/(?!//)([a-zA-Z0-9._/-][^\s"\'()`<>]*)', text):
        urls.add('https://www.google.com/' + m.group(1).lstrip('/'))
    # clean trailing punctuation
    cleaned=set()
    for u in urls:
        u = u.rstrip('.,;)\\]}>')
        cleaned.add(u)
    return cleaned

def main():
    os.makedirs(MIRROR, exist_ok=True)
    # load html
    html = open(os.path.join(ROOT,'index.html'),encoding='utf-8').read()

    # queue of (url, source_text_holder) - we process html first then js/css files
    downloaded = {}  # url -> local_rel
    queue = []
    # initial: find all localizable urls in html
    for u in extract_urls(html):
        if should_localize(u):
            queue.append(u)

    seen = set()
    MAX = 900
    while queue and len(downloaded) < MAX:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        lp_rel, lp_url = local_path_for(url)
        lp_abs = os.path.join(ROOT, lp_rel)
        ok = curl(url, lp_abs)
        if not ok:
            print('FAIL', url)
            continue
        downloaded[url] = lp_url
        # scan for further urls
        try:
            txt = open(lp_abs, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        for u2 in extract_urls(txt):
            if should_localize(u2) and u2 not in seen:
                queue.append(u2)

    # rewrite html (and we also need to rewrite inside downloaded js/css files)
    def rewrite_text(text):
        # replace longest urls first to avoid partial matches
        items = sorted(downloaded.items(), key=lambda kv: len(kv[0]), reverse=True)
        for u, lp in items:
            text = text.replace(u, lp)
            # also scheme-relative form
            if u.startswith('https://'):
                sr = '//' + u[len('https://'):]
                text = text.replace(sr, lp)
        return text

    html2 = rewrite_text(html)
    open(os.path.join(ROOT,'index.html'),'w',encoding='utf-8').write(html2)

    # rewrite inside downloaded asset files too
    for u, lp in downloaded.items():
        lp_abs = os.path.join(ROOT, lp.lstrip('/'))
        if not lp_abs.endswith(('.js','.css','.html')):
            continue
        try:
            t = open(lp_abs, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        t2 = rewrite_text(t)
        if t2 != t:
            open(lp_abs,'w',encoding='utf-8').write(t2)

    print('Downloaded', len(downloaded), 'assets')
    # report any still-external gstatic refs in html
    left = re.findall(r'https?://(www\.gstatic|ssl\.gstatic|fonts\.gstatic)[^\s"\'()`<>]+', html2)
    print('Remaining gstatic refs in html:', len(set(left)))

if __name__ == '__main__':
    main()
