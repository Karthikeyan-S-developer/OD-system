const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const csv = require('csv-parse/lib/sync');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const { User, Department } = require('../models');

router.post('/upload-users', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ ok:false, error: 'file required' });
    const path = req.file.path;
    let rows = [];
    if(req.file.mimetype.includes('sheet') || req.file.originalname.endsWith('.xlsx')){
      const wb = xlsx.readFile(path);
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(ws);
    } else {
      const txt = require('fs').readFileSync(path, 'utf8');
      rows = csv(txt, { columns: true, skip_empty_lines: true });
    }
    const created = [];
    for(const r of rows){
      if(!r.email) continue;
      const hash = await bcrypt.hash(r.password || 'password123', 10);
      const user = await User.create({ email: r.email, password_hash: hash, full_name: r.full_name || r.email, role: r.role || 'student', verified: true });
      created.push({ id: user.id, email: user.email });
    }
    res.json({ ok:true, created });
  }catch(e){ console.error(e); res.status(500).json({ ok:false, error: e.message }); }
});

router.get('/users', async (req,res)=>{
  try{ const users = await User.findAll(); res.json({ ok:true, users }); }catch(e){ res.status(500).json({ ok:false, error: e.message }); }
});

router.post('/departments', async (req,res)=>{
  try{ const { name } = req.body; if(!name) return res.status(400).json({ ok:false, error:'name required' }); const d = await Department.create({ name }); res.json({ ok:true, department: d }); }catch(e){ res.status(500).json({ ok:false, error: e.message }); }
});

router.patch('/users/:id', async (req,res)=>{
  try{
    const u = await User.findByPk(req.params.id);
    if(!u) return res.status(404).json({ ok:false, error:'user not found' });
    const { role, verified, department_id } = req.body;
    if(role) u.role = role;
    if(typeof verified !== 'undefined') u.verified = verified;
    if(typeof department_id !== 'undefined') u.department_id = department_id;
    await u.save();
    res.json({ ok:true, user: u });
  }catch(e){ res.status(500).json({ ok:false, error: e.message }); }
});

module.exports = router;