function sortByDueDate() { // Sort tasks by due date
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
}
function sortByPriority() { // Sort tasks by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    renderTasks();
}
function sortByDefault() { // Sort by creation date (id)
    tasks.sort((a, b) => a.id - b.id); 
    renderTasks();
}

function updateTaskStats() {
    const completed = tasks.filter(task => task.completed).length; // Count completed tasks
    const uncompleted = tasks.length - completed; // Count uncompleted tasks
    const stats = document.getElementById('task-stats'); 
    if (stats) {
        stats.textContent = `Remaining: ${uncompleted} | Completed: ${completed} | Total: ${tasks.length}`;
    }
}

// Add event listener for sort options
document.getElementById('sort-tasks').addEventListener('change', function(event) {
    const sortValue = event.target.value;
    if (sortValue === 'due-date') {
        sortByDueDate();
    } else if (sortValue === 'priority') {
        sortByPriority();
    } else if (sortValue === 'default') {
        sortByDefault();
    }
});

const tasks = []; // Array to hold tasks
const form = document.querySelector('form'); // Select the form element

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks so that it doesn't duplicate

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.classList.add(task.priority); // Add priority class
        
        const dueDateObj = parseESTDate(task.dueDate); // Parse due date
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today

        // Calculate days until due
        let dueText= '';
        const daysUntilDue = Math.ceil((dueDateObj - now) / (1000 * 60 * 60 * 24)); // Rounded to full days
        if (daysUntilDue === 0) {
            dueText = 'Due Today'; // If due today
        } else if (daysUntilDue === 1) {
            dueText = 'Due Tomorrow'; // If due tomorrow
        } else if (daysUntilDue < 0) {
            dueText = `OVERDUE`; // If overdue
        } else {
            dueText = `Due in ${daysUntilDue} days`; // If due in future
        }

        // Add classes based on due status
        if (dueDateObj < now) {
            li.classList.add('overdue'); // Add overdue class if the task is past due
        }
        if (dueDateObj.toDateString() === now.toDateString()) {
            li.classList.add('due-today'); // Add due-today class if the task
        }
        if (task.completed) {
            li.classList.add('completed'); // Add completed class if the task is completed
        }

        // Set inner HTML of the list item to have a left and right group
        li.innerHTML = `
            <div class="left-group">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="right-group">
                <span class="due-date">${dueText}</span>
            </div>
        `;

        li.addEventListener('click', function() { // Toggle completed status on click
            task.completed = !task.completed; 
            li.classList.toggle('completed');
            saveData(); // Save the updated task list to localStorage
            updateTaskStats() // Update task statistics
        });
        
        // Create delete button
        const deleteBtn = document.createElement('span'); 
        deleteBtn.innerHTML = '<img src="./icons/trash-icon.svg" alt="Delete Task" width="20" height="20">';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function(event) { // Add event listener for delete
            event.stopPropagation(); // Prevent triggering the li click event
            tasks.splice(tasks.indexOf(task), 1); // Remove task from array
            renderTasks(); // Re-render tasks
            saveData(); // Save the updated task list to localStorage
            updateTaskStats() // Update task statistics
        });
        li.querySelector('.right-group').appendChild(deleteBtn); // Append delete button to the right group in the list item

        taskList.appendChild(li);
    });
    
    
}

function parseESTDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
}

form.addEventListener('submit', function(event) { // Add event listener for form submission
    event.preventDefault(); // Prevents the default behavior of reloading the page
    
    // Select form elements
    const taskInput = document.querySelector('input[type="text"]');
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const dueDateInput = document.getElementById('due-date');

    if (taskInput.value.trim() === '') { // Validate that task name is not empty
        alert('Please enter a task.');
        return;
    }
    const taskNameRegex = /^[a-zA-Z0-9\s.,!?-]{3,60}$/;
    if (!taskNameRegex.test(taskInput.value.trim())) { // Validate task name
        alert('Enter a valid task name under 60 characters and no special characters except .,!?-');
        return;
    }
    if (!priorityInput) { // Validate priority input
        alert('Please select a priority.');
        return;
    }
    if (dueDateInput.value === '') { // Validate due date input
        alert('Please select a due date.');
        return;
    }

    const today = new Date(); 
    today.setHours(0, 0, 0, 0); // Set to start of today
    const dueDate = parseESTDate(dueDateInput.value);

    if (dueDate < today) { // Validate due date is not in the past
        alert('Due date cannot be in the past.');
        return;
    }

    const newTask = {  // Create a new task object
        id: Date.now(),
        text: taskInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };
    tasks.push(newTask); // Add the new task to the tasks array

    renderTasks();
    updateTaskStats(); 
    saveData(); // Save the updated task list to localStorage
    
    // Clear form inputs
    taskInput.value = '';
    document.querySelector('input[name="priority"]:checked').checked = false;
    dueDateInput.value = '';
});

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks) ); // Save tasks array to localStorage
}

function loadData() {
    const savedTasks = localStorage.getItem("tasks"); // Get tasks from localStorage
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        tasks.push(...parsedTasks); // Populate tasks array with saved tasks
        renderTasks(); // Render tasks to the DOM
    }
}

loadData(); // Load tasks from localStorage on page load
updateTaskStats(); // Update task statistics on page load