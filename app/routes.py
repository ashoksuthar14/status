from flask import Blueprint, render_template, jsonify, request
from app.models import Employee, Project, Task
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

main = Blueprint('main', __name__)
db = SQLAlchemy()

@main.route('/')
@main.route('/dashboard')
def dashboard():
    employees = Employee.query.all()
    projects = Project.query.all()
    tasks = Task.query.all()
    
    # Calculate some statistics
    total_employees = len(employees)
    active_projects = len([p for p in projects if p.progress < 100])
    completed_tasks = len([t for t in tasks if t.status == 'Done'])
    
    return render_template('dashboard.html',
                         employees=employees,
                         projects=projects,
                         tasks=tasks,
                         total_employees=total_employees,
                         active_projects=active_projects,
                         completed_tasks=completed_tasks)

@main.route('/employees')
def employees():
    employees = Employee.query.all()
    return render_template('employees.html', employees=employees)

@main.route('/projects')
def projects():
    projects = Project.query.all()
    return render_template('projects.html', projects=projects)

@main.route('/tasks')
def tasks():
    tasks = Task.query.all()
    employees = Employee.query.all()  # For the add task modal
    projects = Project.query.all()    # For the add task modal
    return render_template('tasks.html', 
                         tasks=tasks,
                         employees=employees,
                         projects=projects) 

@main.route('/update_task_status', methods=['POST'])
def update_task_status():
    data = request.json
    task = Task.query.filter_by(title=data['task_title']).first()
    if task:
        task.status = data['status']
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

@main.route('/add_task', methods=['POST'])
def add_task():
    try:
        data = request.json
        new_task = Task(
            title=data['title'],
            description=data['description'],
            employee_id=data['assignee_id'],
            project_id=data['project_id'],
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
            priority=data['priority'],
            status='To Do'
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@main.route('/delete_task', methods=['POST'])
def delete_task():
    data = request.json
    task = Task.query.filter_by(title=data['task_title']).first()
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

@main.route('/get_task/<int:task_id>')
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify({
        'title': task.title,
        'description': task.description,
        'employee_id': task.employee_id,
        'project_id': task.project_id,
        'due_date': task.due_date.strftime('%Y-%m-%d'),
        'priority': task.priority,
        'status': task.status
    }) 