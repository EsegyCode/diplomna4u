p = r"C:\Users\Nicky\Desktop\diplomna4u\diplomna4u\src\components\StickyContact.astro"
s = open(p, encoding="utf-8").read()
start = s.find("  // Mock submit")
# remove through next </script>
end = s.find("</script>", start)
s = s[:start] + s[end:]
open(p, "w", encoding="utf-8").write(s)
print("done")