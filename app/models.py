from app import db
from datetime import datetime

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(100))
    department = db.Column(db.String(100))
    skills = db.Column(db.String(500))
    badge_level = db.Column(db.Integer, default=1)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    projects = db.relationship('Project', backref='employee', lazy=True)
    tasks = db.relationship('Task', backref='employee', lazy=True)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    progress = db.Column(db.Integer, default=0)  # 0-100
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    tasks = db.relationship('Task', backref='project', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='To Do')  # To Do, In Progress, Done
    priority = db.Column(db.String(50), default='Medium')  # Low, Medium, High
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('project.id')) 