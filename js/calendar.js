// Display calendar view once DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async function() { 
    const calendarEl = document.getElementById('calendar');
    
    const localTasks = loadEventsFromLocalStorage();
    const holidays = await fetchHolidays();
    
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        contentHeight: 'auto',
        events: [...holidays, ...localTasks],
        eventOrder: "classNames",
        
        dateClick: function(info) { // Handle date click to show tasks for that day
            renderListView(info.dateStr, holidays);
        },

        eventClick: function(info) { // adds the same functionality as dateClick even over the events
            info.jsEvent.preventDefault(); // Prevent default action
            renderListView(info.event.startStr, holidays);
        },

        eventContent: function(arg) {
            if (arg.event.classNames.includes('localTasks')) {
                const [icon, ...textParts] = arg.event.title.split(' ');
                const text = textParts.join(' ');
                return {
                    html: `<span class="task-icon">${icon}</span> <span class="task-text">${text}</span>`
                };
            }
            return true; // Default rendering for holiday events
        }    
    });
    calendar.render();
});

// Render the list view for tasks on a specific date
function renderListView(dateStr, holidays) { 
    const listEl = document.getElementById('day-list-view');
    listEl.innerHTML = ''; // Clear previous content

    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks from localStorage
    const filteredTasks = tasks.filter(task => task.dueDate === dateStr); // Filter tasks for the selected date
    
    const ul = document.createElement('ul');
    ul.classList.add('task-list');

    filteredTasks.forEach(task => { // Create list items for each task
        const li = document.createElement('li');
        li.classList.add('task-item', task.priority);
        li.innerHTML = `<div class="task-text">${task.text}</div>`;
        if (task.completed) {
            li.classList.add('completed');
        }
        li.addEventListener('click', function() { // Toggle completed status on click
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderListView(dateStr, holidays); // Re-render the list view
        });
        ul.appendChild(li); // Append the list item to the unordered list
    });
    listEl.appendChild(ul); // Append the unordered list to the day-list-view div
};

// Fetch public holiday data from the API for the current year in the US 
async function fetchHolidays() {   
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

// Load tasks from localStorage and convert them into FullCalendar event objects
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
                classNames: ['localTasks'],
                extendedProps: {
                    priority: task.priority,
                    completed: task.completed
                }
            };
        });
    } 
    catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
    }
};


