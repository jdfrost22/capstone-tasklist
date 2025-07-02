document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
    });
    calendar.render();
});

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

const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: calendarEvents
});
calendar.render();

