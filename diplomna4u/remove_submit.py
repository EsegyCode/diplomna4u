p = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u\src\components\QuickOrder.astro"
s = open(p, encoding="utf-8").read()
start = s.find("    f.addEventListener('submit'")
end = s.find("    });", start) + len("    });")
# also remove newline after
if start>=0 and end>start:
    s = s[:start] + s[end:]
    s = s.replace("\n\n\n", "\n\n")
    open(p, "w", encoding="utf-8").write(s)
    print("done")
else:
    print("not found", start, end)