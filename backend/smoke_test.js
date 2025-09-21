const axios = require('axios');
(async ()=>{
  try{
    const base = 'http://localhost:4000/api';
    console.log('health', (await axios.get(base+'/health')).data);
    const email = 'testuser@example.com';
    try{ 
      await axios.post(base+'/auth/register', { email, password: 'pass123', full_name: 'Test User' }); 
      console.log('registered'); 
    }catch(e){ console.log('register err', e.response?.data||e.message); }
    const login = await axios.post(base+'/auth/login', { email, password: 'pass123' }).catch(e=>{ console.log('login err', e.response?.data||e.message); return null; });
    if(!login) return;
    console.log('login ok', login.data.user);
    const token = login.data.access_token;
    const od = await axios.post(base+'/od', { title: 'Test OD', reason: 'Testing', type: 'OD', from_date: '2025-09-21', to_date: '2025-09-21' }, { headers:{ Authorization: 'Bearer '+token } });
    console.log('od create', od.data);
  }catch(e){ console.error('smoke error full', { message: e.message, response: e.response && { status: e.response.status, data: e.response.data } }); }
})();