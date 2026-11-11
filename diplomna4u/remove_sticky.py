p = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u\src\components\StickyContact.astro"
s = open(p, encoding="utf-8").read()
start = s.find("    const form = document.getElementById('stickyForm')")
# remove from that line to closing of event listener block before closing })
endmarker = "  });\n"
idx = s.find(endmarker, start)
if idx>=0:
    s = s[:start] + "  const form = document.getElementById('stickyForm');\n  // form submission handled by src/scripts/lead-form.ts\n" + s[idx+len(endmarker):]
    open(p, "w", encoding="utf-8").write(s)
    print("done")
else:
    print("not found")