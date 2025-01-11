from app import db
from app.models import Employee, Project, Task
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker()

def create_fake_data():
    # Check if data already exists
    if Employee.query.first():
        return

    # Create employees
    skills_list = ['Python', 'JavaScript', 'React', 'Flask', 'SQL', 'AWS', 
                   'Docker', 'Git', 'Node.js', 'MongoDB']
    roles = ['Software Engineer', 'Project Manager', 'UI/UX Designer', 
             'Data Analyst', 'DevOps Engineer']
    departments = ['Engineering', 'Design', 'Product', 'Operations']

    employees = []
    for _ in range(10):
        employee = Employee(
            name=fake.name(),
            email=fake.email(),
            role=random.choice(roles),
            department=random.choice(departments),
            skills=', '.join(random.sample(skills_list, 4)),
            badge_level=random.randint(1, 5),
            join_date=fake.date_time_between(start_date='-2y')
        )
        employees.append(employee)
        db.session.add(employee)

    db.session.commit()

    # Create projects
    project_status = ['Planning', 'In Progress', 'Testing', 'Completed']
    
    for _ in range(15):
        start_date = fake.date_time_between(start_date='-6M')
        project = Project(
            title=fake.catch_phrase(),
            description=fake.text(),
            progress=random.randint(0, 100),
            start_date=start_date,
            end_date=start_date + timedelta(days=random.randint(30, 180)),
            employee_id=random.choice(employees).id
        )
        db.session.add(project)

    db.session.commit()

    # Create tasks
    status_choices = ['To Do', 'In Progress', 'Done']
    priority_choices = ['Low', 'Medium', 'High']
    projects = Project.query.all()

    for _ in range(50):
        due_date = fake.date_time_between(start_date='now', end_date='+3M')
        task = Task(
            title=fake.sentence(),
            description=fake.text(),
            status=random.choice(status_choices),
            priority=random.choice(priority_choices),
            due_date=due_date,
            employee_id=random.choice(employees).id,
            project_id=random.choice(projects).id
        )
        db.session.add(task)

    db.session.commit() 