const fs=require('fs'),{spawnSync}=require('child_process');
for(const f of ['dashboard.html','dressroom.html','admin.html','compare.html','achievements.html','visual-lab.html']){
  const h=fs.readFileSync(f,'utf8'),open='<script type="module">',a=h.indexOf(open)+open.length,b=h.indexOf('</script>',a);
  if(a<open.length||b<0)throw new Error(`${f}: module script not found`);
  const checked=spawnSync(process.execPath,['--input-type=module','--check'],{input:h.slice(a,b),encoding:'utf8'});
  if(checked.status!==0)throw new Error(`${f}: ${checked.stderr||checked.stdout}`);
  console.log(`${f}: module syntax PASS`);
}
