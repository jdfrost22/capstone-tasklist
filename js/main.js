const tasks = []; // Array to hold tasks

const form = document.querySelector('form'); // Select the form element

form.addEventListener('submit', function(event) { // Add event listener for form submission
    event.preventDefault(); // Prevent default form submission behavior
    
    // Select form elements
    const taskInput = document.querySelector('input[type="text"]');
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const dueDateInput = document.getElementById('due-date');

    const newTask = {  // Create a new task object
        id: Date.now(),
        text: taskInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false
    }
    tasks.push(newTask); // Add the new task to the tasks array
    console.log(tasks); // Log the tasks array to the console

    // Clear form inputs
    taskInput.value = '';
    priorityInput.checked = false;
    dueDateInput.value = '';
});



