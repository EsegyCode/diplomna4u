import os, re

ROOT = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u"
SKIP_DIRS = {"node_modules", "dist", ".git", ".astro", ".vscode"}
EXT = {".astro",".ts",".tsx",".js",".json",".md",".mdx",".html",".css",".yml",".yaml",".txt"}

def latin1_artifact(s):
    return any(0x0080 <= ord(ch) <= 0x00FF for ch in s)

def cyrillic(s):
    return any("\u0400" <= ch <= "\u04FF" for ch in s)

def fix_token(tok):
    if not latin1_artifact(tok):
        return None
    for enc in ("cp1251","latin-1"):
        try:
            dec = tok.encode(enc).decode("utf-8")
        except Exception:
            continue
        if dec != tok and cyrillic(dec) and "\ufffd" not in dec:
            return dec
    return None

files_fixed = 0
total_tokens = 0
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
            if part.strip() == "":
                new_parts.append(part); continue
            dec = fix_token(part)
            if dec is not None:
                new_parts.append(dec); changed = True; hits += 1
            else:
                new_parts.append(part)
        if changed:
            with open(full, "w", encoding="utf-8", newline="") as f:
                f.write("".join(new_parts))
            files_fixed += 1
            total_tokens += hits
            print("FIXED:", full, "tokens=", hits)

print("FILES FIXED:", files_fixed, "TOKENS:", total_tokens)
