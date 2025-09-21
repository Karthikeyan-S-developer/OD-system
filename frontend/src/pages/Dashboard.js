import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
	const [list, setList] = useState([]);
	const [form, setForm] = useState({ title: '', reason: '', from_date: '', to_date: '' });
	const [msg, setMsg] = useState('');

	useEffect(() => {
		const load = async () => {
			try {
				const r = await API.get('/od/mine');
				setList(r.data.list || []);
			} catch (e) {
				console.error(e);
			}
		};
		load();
	}, []);

	const submit = async (e) => {
		e.preventDefault();
		setMsg('');
		try {
			const r = await API.post('/od', form);
			setMsg('Created');
			setList(prev => [r.data.od, ...prev]);
			setForm({ title: '', reason: '', from_date: '', to_date: '' });
		} catch (e) {
			setMsg(e.response?.data?.error || e.message);
		}
	};

	return (
		<div>
			<h3 className="mb-3">Dashboard</h3>
			<div className="row g-4">
				<div className="col-md-6">
					<div className="glass-card">
						<h4>Apply for OD</h4>
						<form className="mt-3" onSubmit={submit}>
							<div className="mb-3"><input className="form-control" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
							<div className="row g-2">
								<div className="col"><input className="form-control" placeholder="From date (YYYY-MM-DD)" value={form.from_date} onChange={e => setForm({ ...form, from_date: e.target.value })} /></div>
								<div className="col"><input className="form-control" placeholder="To date (YYYY-MM-DD)" value={form.to_date} onChange={e => setForm({ ...form, to_date: e.target.value })} /></div>
							</div>
							<div className="mb-3 mt-3"><textarea className="form-control" rows={4} placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></div>
							<div className="d-flex justify-content-end"><button className="btn btn-primary">Submit</button></div>
						</form>
						{msg && <div className="alert alert-info mt-3">{msg}</div>}
					</div>
				</div>

				<div className="col-md-6">
					<div className="glass-card">
						<h4>My Requests</h4>
						<div className="mt-3">
							{list.length === 0 ? <div className="muted">No requests</div> : (
								<table className="table">
									<thead>
										<tr><th>Title</th><th>Status</th><th>Date</th></tr>
									</thead>
									<tbody>
										{list.map(i => (
											<tr key={i.id}>
												<td>{i.title}</td>
												<td>{i.status}</td>
												<td>{i.from_date}</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}