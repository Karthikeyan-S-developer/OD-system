const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { ODRequest, ODAttachment, User, AuditLog } = require('../models');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req,res,next)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ ok:false, error:'No token' });
  const token = auth.split(' ')[1];
  try{ const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret'); req.user = payload; next(); }catch(e){ return res.status(401).json({ ok:false, error:'Invalid token' }); }
};

router.post('/', authMiddleware, upload.array('attachments',5), async (req,res)=>{
  try{
    if(req.user.role !== 'student') return res.status(403).json({ ok:false, error:'Only students can submit' });
    const { title, reason, type, from_date, to_date } = req.body;
    const od = await ODRequest.create({ student_id: req.user.id, title, reason, type, from_date, to_date });
    if(req.files && req.files.length){
      for(const f of req.files){ await ODAttachment.create({ od_request_id: od.id, filename: f.originalname, filepath: f.path, mimetype: f.mimetype, size: f.size }); }
    }
    // audit
    try{ await AuditLog.create({ action: 'create_od', user_id: req.user.id, details: JSON.stringify({ od_id: od.id }) }); }catch(e){}
    res.json({ ok:true, od });
  }catch(e){ console.error(e); res.status(500).json({ ok:false, error: e.message }); }
});

router.get('/', authMiddleware, async (req,res)=>{
  try{
    if(req.user.role === 'student'){ const list = await ODRequest.findAll({ where: { student_id: req.user.id } }); return res.json({ ok:true, list }); }
    if(req.user.role === 'approver'){
      // approver sees pending in their department
      const user = await User.findByPk(req.user.id);
      const list = await ODRequest.findAll({ where: { department_id: user.department_id, status: 'pending' } });
      return res.json({ ok:true, list });
    }
    const list = await ODRequest.findAll(); return res.json({ ok:true, list });
  }catch(e){ console.error(e); res.status(500).json({ ok:false, error: e.message }); }
});

// Get current user's requests
router.get('/mine', authMiddleware, async (req,res)=>{
  try{ const list = await ODRequest.findAll({ where: { student_id: req.user.id } }); res.json({ ok:true, list }); }catch(e){ res.status(500).json({ ok:false, error: e.message }); }
});

// Approve or reject
router.post('/approve/:id', authMiddleware, async (req,res)=>{
  try{
    if(req.user.role !== 'approver') return res.status(403).json({ ok:false, error:'Only approvers' });
    const od = await ODRequest.findByPk(req.params.id);
    if(!od) return res.status(404).json({ ok:false, error:'Not found' });
    const { action, comment } = req.body; // action = 'approve'|'reject'
    od.status = action === 'approve' ? 'approved' : 'rejected';
    od.faculty_id = req.user.id;
    od.comments = comment || null;
    await od.save();
    try{ await AuditLog.create({ action: action === 'approve' ? 'approve_od' : 'reject_od', user_id: req.user.id, details: JSON.stringify({ od_id: od.id }) }); }catch(e){}
    res.json({ ok:true, od });
  }catch(e){ console.error(e); res.status(500).json({ ok:false, error: e.message }); }
});

module.exports = router;