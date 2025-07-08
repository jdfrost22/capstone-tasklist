document.addEventListener('DOMContentLoaded', async function() { 
    const calendarEl = document.getElementById('calendar');
    
    const localTasks = loadEventsFromLocalStorage();
    const holidays = await fetchHolidays();
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [...localTasks, ...holidays],
    });
    calendar.render();
});

async function fetchHolidays() {
    const year = new Date().getFullYear();
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/us`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch holidays');
        }
        const holidays = await response.json();
        return holidays.map(holiday => {
            return {
                title: holiday.localName,
                start: holiday.date,
                allDay: true,
                classNames: ['holiday']
            };
        });

    }
    catch (error) {
        console.error('Error fetching holidays:', error);
    return [];
    }
}

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


