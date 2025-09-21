import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminUpload from './pages/AdminUpload';

export default function App(){
	return (
		<BrowserRouter>
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
				<div className="container">
					<Link className="navbar-brand" to='/'>OD System</Link>
					<div className="collapse navbar-collapse">
						<ul className="navbar-nav ms-auto">
							<li className="nav-item"><Link className="nav-link" to='/register'>Register</Link></li>
							<li className="nav-item"><Link className="nav-link" to='/login'>Login</Link></li>
							<li className="nav-item"><Link className="nav-link" to='/dashboard'>Dashboard</Link></li>
							<li className="nav-item"><Link className="nav-link" to='/admin'>Admin</Link></li>
						</ul>
					</div>
				</div>
			</nav>
			<div className="container">
				<Routes>
					<Route path='/' element={<div className="p-5 bg-light rounded-3"><h1>Welcome to OD Approval System</h1><p className="lead">Apply for OD, track approvals, and manage users.</p></div>} />
					<Route path='/register' element={<Register/>} />
					<Route path='/login' element={<Login/>} />
					<Route path='/dashboard' element={<Dashboard/>} />
					<Route path='/admin' element={<AdminUpload/>} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}