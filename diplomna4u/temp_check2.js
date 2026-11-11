const fs=require('fs');
const html=fs.readFileSync('dist/index.html','utf8');
const start=html.indexOf('<script>(function(){const pricingJson');
const end=html.indexOf('</script>', start);
const script=html.slice(start, end);
fs.writeFileSync('temp_script.js', script.replace(/^<script>/,''), 'utf8');
console.log('extracted length', script.length);
"