(async ()=>{
  try{
    const { fetch } = await import('undici');
    const u = 'http://localhost:5173/api/analyses/index.json?_=' + Date.now();
    const res = await fetch(u);
    console.log('STATUS', res.status);
    const txt = await res.text();
    console.log(txt);
  }catch(e){
    console.error('ERROR', e && e.stack ? e.stack : e);
    process.exit(1);
  }
})();
