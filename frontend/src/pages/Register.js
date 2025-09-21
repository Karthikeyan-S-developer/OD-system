import React, { useState } from 'react';
import { registerUser } from '../api/auth';

export default function Register() {
	const [form, setForm] = useState({ email: '', password: '', full_name: '' });
	const [msg, setMsg] = useState('');

	const submit = async (e) => {
		e.preventDefault(); setMsg('');
		try {
			const r = await registerUser(form);
			setMsg(r.data.message || 'Registered');
		} catch (e) {
			setMsg(e?.error || e?.message || 'Network error');
		}
	};

	return (
		<div className="row justify-content-center">
			<div className="col-md-6">
				<div className="glass-card">
					<h3 className="mb-3">Register</h3>
					<form onSubmit={submit}>
						<div className="mb-3"><input className="form-control" placeholder="Full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
						<div className="mb-3"><input className="form-control" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
						<div className="mb-3"><input className="form-control" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
						<div className="d-flex justify-content-end"><button className="btn btn-primary">Register</button></div>
					</form>
					{msg && <div className="alert alert-info mt-3">{msg}</div>}
				</div>
			</div>
		</div>
	);
}