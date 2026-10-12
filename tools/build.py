"""Rebuild the radar layer into the static site.

Usage (from the repo root):  python3 tools/build.py

1. Concatenates radar-layer/src/*.js (in the order below) into one IIFE.
2. Applies the A/B/C -> X/Y/Z brand rename used on the public site.
3. Appends it to the original Next.js chunk (tools/base/...orig.js) and writes it to
   site/next/static/chunks/3qjcn3l3yqgm5.js. Appending to an existing chunk (instead of adding a
   <script> tag) is deliberate: a separate script tag made React hydration fail.
4. Copies radar-layer/styles/theme.css and radars.css into the two <style> blocks in site/index.html.
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
ORDER = ["r2-head.js", "sess-data.js", "r2-body.js", "r2-qdots.js", "keep-run.js", "keep-method.js", "r2-tail.js"]
REP = [("Brand A, B and C", "Brand X, Y and Z"), ("Brands A to C", "Brands X to Z"), ("Brand A", "Brand X"),
       ("Brand B", "Brand Y"), ("Brand C", "Brand Z")]

def ren(s):
    for a, b in REP:
        s = s.replace(a, b)
    return s

r = "".join((ROOT / "radar-layer/src" / f).read_text() for f in ORDER)
r = r.replace('"Brand "+brand', 'BN(brand)').replace('"Brand "+rivals[0]', 'BN(rivals[0])').replace('"Brand "+rivals[1]', 'BN(rivals[1])')
r = r.replace("'Brand '+x[6]", "BN(x[6])").replace("'>Brand '+b+'</t", "'>'+BN(b)+'</t")
r = r.replace("var m=/Brand\\s+([ABC])/.exec(o.textContent);if(!m)return;brand=m[1];",
              "var m=/Brand\\s+([XYZ])/.exec(o.textContent);if(!m)return;brand={X:'A',Y:'B',Z:'C'}[m[1]];")
r = ren(r)
r = r.replace("(function(){\n", "(function(){\n  var BN=function(b){return 'Brand '+({A:'X',B:'Y',C:'Z'}[b]||b)};\n", 1)
base = (ROOT / "tools/base/3qjcn3l3yqgm5.orig.js").read_text()
(ROOT / "site/next/static/chunks/3qjcn3l3yqgm5.js").write_text(base + "\n;" + r)

idx = ROOT / "site/index.html"
html = idx.read_text(encoding="utf-8")
for sid, fn in [("geo-radar-theme", "theme.css"), ("gr-vis-radar-css", "radars.css")]:
    css = (ROOT / "radar-layer/styles" / fn).read_text()
    html = re.sub(r'(<style id="' + sid + r'">)(.*?)(</style>)', lambda m: m.group(1) + "\n" + css + m.group(3), html, count=1, flags=re.S)
idx.write_text(html, encoding="utf-8")
print("built")
