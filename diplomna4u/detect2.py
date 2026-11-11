import os, re, json

ROOT = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u"
SKIP_DIRS = {"node_modules", "dist", ".git", ".astro", ".vscode"}
EXT = {".astro",".ts",".tsx",".js",".json",".md",".mdx",".html",".css",".yml",".yaml",".txt"}

# CP1251 mojibake in UTF-8 usually appears as runs containing Р or С followed by latin/cyrillic artifacts
PAT = re.compile(r'(?:Р[\u0080-\u00BF\u0400-\u04FF\u2018-\u201F]|С[\u0080-\u00BF\u0400-\u04FF\u2018-\u201F]|[ÐÑ][\x80-\xBF]|\ufffd|�){3,}', re.UNICODE)

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        ext = os.path.splitext(fn)[1].lower()
        if ext not in EXT:
            continue
        full = os.path.join(dirpath, fn)
        if any(s in full for s in SKIP_DIRS):
            continue
        try:
            s = open(full, encoding="utf-8").read()
        except Exception:
            continue
        matches = PAT.findall(s)
        if matches:
            files.append(full)
            print("MATCH:", full, "count=", len(matches))
            for m in matches[:3]:
                print("   ", m[:80])

json.dump(files, open("mojibake_files.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print("TOTAL:", len(files))
PY