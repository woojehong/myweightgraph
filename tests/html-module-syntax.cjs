const fs=require('fs'),vm=require('vm');
for(const f of ['dressroom.html','admin.html','compare.html','achievements.html']){
  const h=fs.readFileSync(f,'utf8'),open='<script type="module">',a=h.indexOf(open)+open.length,b=h.indexOf('</script>',a);
  new vm.SourceTextModule(h.slice(a,b));
  console.log(`${f}: module syntax PASS`);
}
