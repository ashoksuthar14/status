// Task checkbox handling
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskElement = this.closest('.task-item');
            if (taskElement) {
                if (this.checked) {
                    taskElement.classList.add('opacity-50');
                } else {
                    taskElement.classList.remove('opacity-50');
                }
            }
        });
    });
});

// Progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const target = parseInt(bar.getAttribute('data-progress'));
        let current = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
            if (current >= target) {
                clearInterval(interval);
            } else {
                current += increment;
                bar.style.width = `${current}%`;
            }
        }, 10);
    });
}

// Notification system
class NotificationManager {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.searchable-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', function() {
    animateProgressBars();
    initializeSearch();
}); 