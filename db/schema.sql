
CREATE DATABASE IF NOT EXISTS od_system;
USE od_system;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role ENUM('student','approver','admin') NOT NULL DEFAULT 'student',
  verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  phone VARCHAR(20),
  department_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE od_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  title VARCHAR(200) NOT NULL,
  reason TEXT NOT NULL,
  type ENUM('OD','Leave') DEFAULT 'OD',
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  from_time TIME,
  to_time TIME,
  status ENUM('pending','approved','rejected','withdrawn') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE od_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  od_request_id INT,
  filename VARCHAR(255),
  filepath VARCHAR(255),
  mimetype VARCHAR(100),
  size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (od_request_id) REFERENCES od_requests(id) ON DELETE CASCADE
);

CREATE TABLE od_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  od_request_id INT,
  author_id INT,
  comment_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (od_request_id) REFERENCES od_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE approver_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  approver_id INT,
  department_id INT,
  FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  target_type VARCHAR(100),
  target_id INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
