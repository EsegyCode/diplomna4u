import os, re, json

ROOT = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u"
SKIP_DIRS = {"node_modules", "dist", ".git", ".astro", ".vscode"}
EXT = {".astro",".ts",".tsx",".js",".json",".md",".mdx",".html",".css",".yml",".yaml",".txt"}

def cyrillic(s):
    return any("\u0400" <= ch <= "\u04FF" for ch in s)

def fix_token(tok):
    for enc in ("cp1251","latin-1"):
        try:
            dec = tok.encode(enc).decode("utf-8")
        except Exception:
            continue
        if dec != tok and cyrillic(dec) and "\ufffd" not in dec:
            return dec
    return None

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
        parts = re.split(r'(\s+)', s)
        changed = False
        new_parts = []
        hits = 0
        for part in parts:
            if part.strip()=="":
                new_parts.append(part); continue
            # Try transform whole chunk; if fails, leave
            dec = fix_token(part)
            if dec is not None:
                new_parts.append(dec); changed=True; hits+=1
            else:
                new_parts.append(part)
        if changed:
            files.append(full)
            print("MOJIBAKE:", full, "tokens_fixed=", hits)
            sample_old = [p for p,a in zip(parts,new_parts) if p!=a][:1]
            if sample_old:
                print("   OLD:", sample_old[0][:100])

json.dump(files, open("mojibake_files.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print("TOTAL:", len(files))
PY