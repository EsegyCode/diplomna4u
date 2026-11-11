import re
s = open(r"src/components/ServicePage.astro", encoding="utf-8").read()
import re
m = re.search(r"<h2>(.*?)</h2>", s)
tok = m.group(1)
print("TOKEN REPR:", repr(tok))
for enc in ("cp1251","latin-1"):
    try:
        dec = tok.encode(enc).decode("utf-8")
        print(enc, "->", repr(dec))
    except Exception as e:
        print(enc, "ERR", e)
