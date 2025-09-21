
USE od_system;
INSERT INTO departments (name) VALUES ('Computer Science'), ('Electronics'), ('Administration');

-- The password_hash values are placeholders; use API to create users or replace with hashed values.
INSERT INTO users (email, password_hash, full_name, role, verified, phone, department_id)
VALUES
('admin@example.com', '$2b$10$REPLACEHASH', 'System Admin', 'admin', TRUE, '9999999999', 3),
('approver@example.com', '$2b$10$REPLACEHASH', 'Prof Approver', 'approver', TRUE, '9876543210', 1),
('student@example.com', '$2b$10$REPLACEHASH', 'Student One', 'student', TRUE, '9123456780', 1);

INSERT INTO od_requests (student_id, title, reason, type, from_date, to_date, status)
VALUES (3, 'Medical Appointment', 'Doctor appointment', 'OD', '2025-09-25', '2025-09-25', 'pending');
