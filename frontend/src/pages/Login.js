import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [form, setForm] = useState({ email: '', password: '' });
	const [err, setErr] = useState('');
	const nav = useNavigate();

	const submit = async (e) => {
		e.preventDefault();
		setErr('');
		try {
			const r = await loginUser(form);
			localStorage.setItem('token', r.data.access_token);
			localStorage.setItem('user', JSON.stringify(r.data.user));
			nav('/dashboard');
		} catch (e) {
			setErr(e?.error || e?.message || 'Network error');
		}
	};

	return (
		<div className="row justify-content-center">
			<div className="col-md-6">
				<div className="glass-card">
					<h3 className="mb-3">Login</h3>
					<form onSubmit={submit}>
						<div className="mb-3">
							<input className="form-control" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
						</div>
						<div className="mb-3">
							<input className="form-control" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
						</div>
						<div className="d-flex justify-content-end">
							<button className="btn btn-primary">Login</button>
						</div>
					</form>
					{err && <div className="alert alert-danger mt-3">{err}</div>}
				</div>
			</div>
		</div>
	);
}