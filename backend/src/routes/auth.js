const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false
});

router.post('/register', async (req,res)=>{
  try{
    const { email, password, full_name, phone, department_id } = req.body;
    if(!email || !password) return res.status(400).json({ ok:false, error:'email and password required' });
    const exists = await User.findOne({ where: { email } });
    if(exists) return res.status(400).json({ ok:false, error:'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const token = Math.random().toString(36).slice(2);
    const user = await User.create({ email, password_hash: hash, full_name, phone, department_id, verification_token: token, verified: false });
    const verifyLink = `${req.protocol}://${req.get('host')}/api/auth/verify/${token}`;
    try { await transporter.sendMail({ from: 'no-reply@odsystem.local', to: email, subject: 'Verify your email', text: `Click to verify: ${verifyLink}` }); } catch(e){ console.warn('mail send failed', e.message); }
    res.json({ ok: true, message: 'Registered. Check email for verification.' });
  }catch(e){ console.error(e); res.status(500).json({ ok:false, error: e.message}); }
});

router.get('/verify/:token', async (req,res)=>{
  const token = req.params.token;
  const user = await User.findOne({ where: { verification_token: token } });
  if(!user) return res.status(400).send('Invalid token');
  user.verified = true; user.verification_token = null; await user.save();
  res.send('Email verified. You can now login.');
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if(!user) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  if(!user.verified) return res.status(403).json({ ok:false, error:'Email not verified' });
  const match = await bcrypt.compare(password, user.password_hash);
  if(!match) return res.status(401).json({ ok:false, error:'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  res.json({ ok:true, access_token: token, user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } });
});

module.exports = router;