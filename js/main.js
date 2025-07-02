const tasks = []; // Array to hold tasks

const form = document.querySelector('form'); // Select the form element

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks so that it doesn't duplicate


    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.classList.add(task.priority); // Add priority class
        li.innerHTML = `
            <div class="left-group">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="right-group">
                <span class="due-date">Due: ${parseESTDate(task.dueDate).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</span>
            </div>
        `;
        const now = new Date();
        const dueDate = parseESTDate(task.dueDate);
    
        if (dueDate < now) {
            li.classList.add('overdue'); // Add overdue class if the task is past due
        }
        if (dueDate.toDateString() === now.toDateString()) {
            li.classList.add('due-today'); // Add due-today class if the task
        }
        if (task.completed) {
            li.classList.add('completed'); // Add completed class if the task is completed
        }
        li.addEventListener('click', function() { // Toggle completed status on click
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveData(); // Save the updated task list to localStorage
        });

        const deleteBtn = document.createElement('span'); // Create delete button
        deleteBtn.innerHTML = '<img src="./icons/trash-icon.svg" alt="Delete Task" width="20" height="20">';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function(event) { // Add event listener for delete
            event.stopPropagation(); // Prevent triggering the li click event
            tasks.splice(tasks.indexOf(task), 1); // Remove task from array
            renderTasks(); // Re-render tasks
            saveData(); // Save the updated task list to localStorage
        });
        li.querySelector('.right-group').appendChild(deleteBtn); // Append delete button to the list item

        taskList.appendChild(li);
    });
    
}

function parseESTDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
}

form.addEventListener('submit', function(event) { // Add event listener for form submission
    event.preventDefault(); // Prevent default form submission behavior
    
    // Select form elements
    const taskInput = document.querySelector('input[type="text"]');
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const dueDateInput = document.getElementById('due-date');

    if (taskInput.value.trim() === '') { // Validate task input
        alert('Please enter a task.');
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
    }
    tasks.push(newTask); // Add the new task to the tasks array
    // console.log(tasks); // Log the tasks array to the console
    renderTasks();
    saveData(); // Save the updated task list to localStorage
    // Clear form inputs
    taskInput.value = '';
    priorityInput.checked = false;
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
