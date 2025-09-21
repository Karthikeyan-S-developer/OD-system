import axios from 'axios';

const resolvedBase = (process.env.REACT_APP_API_URL||'http://localhost:4000').replace(/\/+$/,'') + '/api';
console.info('[API] baseURL =', resolvedBase);
const API = axios.create({ baseURL: resolvedBase, timeout: 15000 });

// Attach Authorization header automatically from localStorage
API.interceptors.request.use(cfg => {
	try{
		const t = localStorage.getItem('token');
		if(t) cfg.headers = Object.assign({}, cfg.headers, { Authorization: 'Bearer '+t });
	}catch(e){}
	return cfg;
});

API.interceptors.response.use(
	r => r,
	e => {
		// Normalize error so front-end can show a friendly message
		const payload = e?.response?.data || { error: e.message || 'Network Error' };
		console.error('[API] error', payload);
		return Promise.reject(payload);
	}
);

export default API;