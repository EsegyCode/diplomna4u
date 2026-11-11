p = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u\src\scripts\lead-form.ts"
lines = open(p, encoding="utf-8").read().splitlines()
out = []
for line in lines:
    if line.strip().startswith("```"):
        break
    out.append(line)
open(p, "w", encoding="utf-8").write("\n".join(out) + "\n")
print("done")