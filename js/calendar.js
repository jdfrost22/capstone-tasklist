document.addEventListener('DOMContentLoaded', async function() { // Display calendar view once DOM content is fully loaded
    const calendarEl = document.getElementById('calendar');
    
    const localTasks = loadEventsFromLocalStorage();
    const holidays = await fetchHolidays();
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [...holidays, ...localTasks],
        eventOrder: "classNames",
        eventContent: function(arg) {
            if (arg.event.classNames.includes('localTasks')) {
                const [icon, ...textParts] = arg.event.title.split(' ');
                const text = textParts.join(' ');
                return {
                    html: `<span class="task-icon">${icon}</span> <span class="task-text">${text}</span>`
                };
            }
            return true; // Default rendering for other events
        }    
    });
    calendar.render();
});

async function fetchHolidays() {   // Fetch public holiday data from the API for the current year in the US 
    const year = new Date().getFullYear();
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/us`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch holidays');
        }
        const holidays = await response.json();
        return holidays.map(holiday => { // Map the API response to FullCalendar event object
            return {
                title: holiday.localName,
                start: holiday.date,
                allDay: true,
                classNames: ['holiday']
            };
        });

    }
    catch (error) { // Log any errors during the fetch operation
        console.error('Error fetching holidays:', error);
        return [];
    }
}

function loadEventsFromLocalStorage() {     // Load tasks from localStorage and convert them into FullCalendar event objects
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
                classNames: ['localTasks'],
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


