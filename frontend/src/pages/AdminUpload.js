import React, { useState } from 'react';
import API from '../api';

export default function AdminUpload() {
	const [file, setFile] = useState(null);
	const [msg, setMsg] = useState('');

	const submit = async (e) => {
		e.preventDefault();
		setMsg('');
		if (!file) return setMsg('Select file');
		const fd = new FormData();
		fd.append('file', file);
		try {
			const r = await API.post('/admin/upload-users', fd, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});
			setMsg('Created: ' + JSON.stringify(r.data.created || []));
		} catch (e) {
			setMsg(e?.response?.data?.error || e?.message || 'Upload failed');
		}
	};

	return (
		<div className="row justify-content-center">
			<div className="col-md-8">
				<div className="card">
					<div className="card-body">
						<h3>Admin - Bulk Upload Users (CSV/XLSX)</h3>
						<form className="mt-3" onSubmit={submit}>
							<div className="mb-3">
								<input
									className="form-control"
									type="file"
									accept=".csv,.xlsx"
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
							<button className="btn btn-primary">Upload</button>
						</form>
						{msg && <div className="alert alert-info mt-3">{msg}</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
