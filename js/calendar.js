document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: loadEventsFromLocalStorage()
    });
    calendar.render();
});

function loadEventsFromLocalStorage() {
    const priorityIcons = {
        high: '🔴',
        medium: '🟠',
        low: '🟢'
    };
    const saved = localStorage.getItem('tasks');
    if (!saved) {
        return [];
    }
    try {
        const tasks = JSON.parse(saved);
        return tasks.map(task => {
            return {
                title: `${priorityIcons[task.priority]} ${task.text}`,
                start: task.dueDate,
                allDay: true,
                extendedProps: {
                    priority: task.priority,
                    completed: task.completed
                }
            };
        });
    }   catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
    }
};

const calendarEvents = tasks.map(task => {
    return {
        title: task.text,
        start: task.dueDate,
        extendedProps: {
            priority: task.priority,
            completed: task.completed
        }
    };
});

calendar.render();

