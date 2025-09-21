(async ()=>{
  const url = 'http://localhost:4000/api/auth/login';
  try{
    console.log('OPTIONS preflight:');
    const pre = await fetch(url, { method: 'OPTIONS', headers: { Origin:'http://localhost:3000', 'Access-Control-Request-Method':'POST', 'Access-Control-Request-Headers':'content-type' } });
    console.log('preflight status', pre.status, Object.fromEntries(pre.headers.entries()));
  }catch(e){ console.error('preflight error', e.message); }
  try{
    console.log('POST:');
    const r = await fetch(url, { method: 'POST', headers: { Origin:'http://localhost:3000', 'Content-Type':'application/json' }, body: JSON.stringify({ email:'std@example.com', password:'pass123' }) });
    console.log('post status', r.status); const j = await r.text(); console.log('body', j);
  }catch(e){ console.error('post error', e.message); }
})();