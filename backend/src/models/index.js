const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { tableName: 'departments', timestamps: false });

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student','approver','admin'), defaultValue: 'student' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verification_token: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  department_id: { type: DataTypes.INTEGER }
}, { tableName: 'users', timestamps: false });

const ODRequest = sequelize.define('ODRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: { type: DataTypes.INTEGER },
  faculty_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  reason: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM('OD','Leave') },
  from_date: { type: DataTypes.DATEONLY },
  to_date: { type: DataTypes.DATEONLY },
  from_time: { type: DataTypes.TIME },
  to_time: { type: DataTypes.TIME },
  department_id: { type: DataTypes.INTEGER },
  comments: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('pending','approved','rejected','withdrawn'), defaultValue: 'pending' }
}, { tableName: 'od_requests', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const ODAttachment = sequelize.define('ODAttachment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  od_request_id: { type: DataTypes.INTEGER },
  filename: { type: DataTypes.STRING },
  filepath: { type: DataTypes.STRING },
  mimetype: { type: DataTypes.STRING },
  size: { type: DataTypes.INTEGER }
}, { tableName: 'od_attachments', timestamps: false });

const ODComment = sequelize.define('ODComment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  od_request_id: { type: DataTypes.INTEGER },
  author_id: { type: DataTypes.INTEGER },
  comment_text: { type: DataTypes.TEXT }
}, { tableName: 'od_comments', timestamps: true });

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING },
  user_id: { type: DataTypes.INTEGER },
  details: { type: DataTypes.TEXT }
}, { tableName: 'audit_logs', timestamps: true, createdAt: 'timestamp', updatedAt: false });

User.hasMany(ODRequest, { foreignKey: 'student_id', as: 'requests' });
ODRequest.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

User.hasMany(ODRequest, { foreignKey: 'faculty_id', as: 'approved_requests' });
ODRequest.belongsTo(User, { foreignKey: 'faculty_id', as: 'faculty' });

Department.hasMany(User, { foreignKey: 'department_id' });
User.belongsTo(Department, { foreignKey: 'department_id' });

Department.hasMany(ODRequest, { foreignKey: 'department_id' });
ODRequest.belongsTo(Department, { foreignKey: 'department_id' });

ODRequest.hasMany(ODAttachment, { foreignKey: 'od_request_id' });
ODRequest.hasMany(ODComment, { foreignKey: 'od_request_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });

module.exports = { sequelize, User, ODRequest, ODAttachment, ODComment, Department, AuditLog };