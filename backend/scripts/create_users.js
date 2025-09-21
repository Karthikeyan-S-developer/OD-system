const bcrypt = require('bcryptjs');
const { sequelize, User, Department } = require('../src/models');
(async ()=>{
  await sequelize.sync({ alter: true });
  const [d] = await Department.findOrCreate({ where: { name: 'Computer Science' }, defaults: { name: 'Computer Science' } });
  const hash1 = await bcrypt.hash('pass123', 10);
  const hash2 = await bcrypt.hash('pass123', 10);
  await User.findOrCreate({ where: { email: 'std@example.com' }, defaults: { email: 'std@example.com', password_hash: hash1, full_name: 'Student One', role: 'student', verified: true, department_id: d.id } });
  await User.findOrCreate({ where: { email: 'fac@example.com' }, defaults: { email: 'fac@example.com', password_hash: hash2, full_name: 'Faculty One', role: 'approver', verified: true, department_id: d.id } });
  console.log('created users');
  process.exit(0);
})();
