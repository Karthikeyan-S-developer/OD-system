const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const odRoutes = require('./routes/od');
const adminRoutes = require('./routes/admin');

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/od', odRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (req,res)=>res.json({ok:true}));

// Ensure DB models are synced (creates tables for SQLite fallback)
const syncOptions = (process.env.NODE_ENV === 'production') ? {} : { alter: true };
sequelize.sync(syncOptions).then(()=>{
	app.listen(PORT, '0.0.0.0', ()=>console.log('Server listening on', PORT));
}).catch(err=>{
	console.error('DB sync failed', err.message || err);
	app.listen(PORT, '0.0.0.0', ()=>console.log('Server listening on', PORT));
});