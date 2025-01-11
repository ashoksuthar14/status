document.addEventListener('DOMContentLoaded', function() {
    // Modal handling
    const addTaskModal = document.getElementById('addTaskModal');
    const addTaskBtn = document.querySelector('button:has(.fa-plus)');
    const cancelBtn = addTaskModal.querySelector('button[type="button"]');

    addTaskBtn.addEventListener('click', () => {
        addTaskModal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        addTaskModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    addTaskModal.addEventListener('click', (e) => {
        if (e.target === addTaskModal) {
            addTaskModal.classList.add('hidden');
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const taskItems = document.querySelectorAll('.searchable-item');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        taskItems.forEach(item => {
            const taskTitle = item.querySelector('.text-gray-900').textContent.toLowerCase();
            const projectTitle = item.querySelector('.text-gray-500').textContent.toLowerCase();
            const assignee = item.querySelector('.text-gray-600').textContent.toLowerCase();
            
            if (taskTitle.includes(searchTerm) || 
                projectTitle.includes(searchTerm) || 
                assignee.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Status filter
    const statusFilter = document.querySelector('select');
    statusFilter.addEventListener('change', (e) => {
        const selectedStatus = e.target.value;
        taskItems.forEach(item => {
            const taskStatus = item.querySelector('[class*="rounded-full"]').textContent.trim();
            if (!selectedStatus || taskStatus === selectedStatus) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Checkbox handling
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async function() {
            const taskItem = this.closest('.searchable-item');
            const taskTitle = taskItem.querySelector('.text-gray-900').textContent;
            const statusBadge = taskItem.querySelector('[class*="rounded-full"]');
            
            try {
                const response = await fetch('/update_task_status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        task_title: taskTitle,
                        status: this.checked ? 'Done' : 'To Do'
                    })
                });

                if (response.ok) {
                    // Update the status badge
                    if (this.checked) {
                        statusBadge.className = 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
                        statusBadge.textContent = 'Done';
                    } else {
                        statusBadge.className = 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
                        statusBadge.textContent = 'To Do';
                    }
                    
                    // Show notification
                    NotificationManager.show(
                        `Task marked as ${this.checked ? 'complete' : 'incomplete'}`,
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error updating task status:', error);
                NotificationManager.show('Error updating task status', 'error');
            }
        });
    });

    // Task form submission
    const taskForm = addTaskModal.querySelector('form');
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('task_title').value,
            description: document.getElementById('task_description').value,
            assignee_id: document.getElementById('task_assignee').value,
            project_id: document.getElementById('task_project').value,
            due_date: document.getElementById('task_due_date').value,
            priority: document.getElementById('task_priority').value
        };

        try {
            const response = await fetch('/add_task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Refresh the page to show new task
                location.reload();
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            NotificationManager.show('Error adding task', 'error');
        }
    });

    // Delete task handling
    const deleteButtons = document.querySelectorAll('.fa-trash').parentElement;
    deleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const taskItem = this.closest('.searchable-item');
            const taskTitle = taskItem.querySelector('.text-gray-900').textContent;

            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    const response = await fetch('/delete_task', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            task_title: taskTitle
                        })
                    });

                    if (response.ok) {
                        taskItem.remove();
                        NotificationManager.show('Task deleted successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                    NotificationManager.show('Error deleting task', 'error');
                }
            }
        });
    });

    // Edit task handling
    const editButtons = document.querySelectorAll('.fa-edit').parentElement;
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskItem = this.closest('.searchable-item');
            const taskTitle = taskItem.querySelector('.text-gray-900').textContent;
            
            // Populate the modal with task data and show it
            // This would require additional backend endpoint to get task details
            // and modification of the modal to handle both create and edit modes
        });
    });

    // Sorting functionality
    const headers = document.querySelectorAll('.grid-cols-12 > div');
    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const column = header.textContent.toLowerCase();
            const tasks = Array.from(taskItems);
            
            tasks.sort((a, b) => {
                let aValue, bValue;
                
                switch(column) {
                    case 'task':
                        aValue = a.querySelector('.text-gray-900').textContent;
                        bValue = b.querySelector('.text-gray-900').textContent;
                        break;
                    case 'assignee':
                        aValue = a.querySelector('.text-gray-600').textContent;
                        bValue = b.querySelector('.text-gray-600').textContent;
                        break;
                    case 'due date':
                        aValue = new Date(a.querySelector('.col-span-2 .text-gray-600').textContent);
                        bValue = new Date(b.querySelector('.col-span-2 .text-gray-600').textContent);
                        break;
                    // Add other cases as needed
                }
                
                if (header.dataset.order === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            
            header.dataset.order = header.dataset.order === 'asc' ? 'desc' : 'asc';
            
            const container = document.querySelector('.space-y-2');
            container.innerHTML = '';
            tasks.forEach(task => container.appendChild(task));
        });
    });
}); 