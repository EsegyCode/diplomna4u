import os, re, json

ROOT = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u"
SKIP_DIRS = {"node_modules", "dist", ".git", ".astro", ".vscode"}
EXT = {".astro",".ts",".tsx",".js",".json",".md",".mdx",".html",".css",".yml",".yaml",".txt"}

def is_skip(path):
    parts = path.split(os.sep)
    return any(p in SKIP_DIRS for p in parts)

def cyrillic(s):
    return any("\u0400" <= ch <= "\u04FF" for ch in s)

def try_fix_cp(s, enc):
    # greedy fix runs
    out = []
    i = 0
    n = len(s)
    changed = False
    while i < n:
        best_j = i
        best_dec = None
        j = i
        # extend while decodable
        while j < n:
            chunk = s[i:j+1]
            try:
                dec = chunk.encode(enc).decode("utf-8")
            except Exception:
                break
            # ensure dec differs and has cyrillic
            if dec != chunk and cyrillic(dec):
                best_j = j
                best_dec = dec
            j += 1
        if best_j > i and best_dec is not None:
            out.append(best_dec)
            changed = True
            i = best_j + 1
        else:
            out.append(s[i])
            i += 1
    return "".join(out), changed

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        ext = os.path.splitext(fn)[1].lower()
        if ext not in EXT:
            continue
        full = os.path.join(dirpath, fn)
        if is_skip(full):
            continue
        try:
            s = open(full, encoding="utf-8").read()
        except Exception as e:
            print("skip", full, e)
            continue
        s2, ch = try_fix_cp(s, "cp1251")
        if not ch:
            # try latin-1
            s2, ch = try_fix_cp(s, "latin-1")
        if ch:
            files.append((full, s, s2))
            print("MOJIBAKE:", full)
            # show a sample diff
            for a,b in zip(s.splitlines(), s2.splitlines()):
                if a != b:
                    print("  OLD:", a[:120])
                    print("  NEW:", b[:120])
                    break

json.dump([f[0] for f in files], open("mojibake_files.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
print("total", len(files))
PY