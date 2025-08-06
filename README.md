# capstone-tasklist
# TaskManaged

**TaskManaged** is a responsive, interactive web application designed to help users manage their tasks visually and efficiently. The app features both a task list view and a calendar view, allowing users to add tasks with due dates and priorities, and track completed tasks. Users can sort tasks by due date, priority, or creation time, and each task displays a countdown (e.g., "Due in 3 days") to help with time management. The calendar view integrates U.S. public holidays fetched from an external API and overlays them above tasks on the corresponding dates, providing helpful context for planning. In calendar view, users can select a day and the tasks due on that day will be displayed below the calendar in a list view of the day.

---

### Main Features

1. **Interactive UI with Sorting and Task Completion**  
   Tasks can be sorted by due date, priority, or creation date. Clicking on a task toggles its completion state, which is reflected in both its styling and the live task statistics.

2. **Calendar view and Fetch API Integration**  
   The application fetches U.S. public holidays using the [Nager.Date API](https://date.nager.at), and integrates them directly into the FullCalendar view to be displayed above the task items. 

3. **Calendar-Date-Picker & Dynamic Countdown Display**  
   Users can assign due dates to tasks using an HTML date picker. The interface then dynamically displays how many days are left until each task is due (e.g., “Due Tomorrow”).

### Implemented Requirements

This project fulfills the following requirements from the assignment list:

- **Analyze data stored in arrays and display information**:  
  The application maintains all task data in an array and dynamically analyzes it to update live task statistics (e.g., remaining, completed, and total tasks).

- **Use a regular expression to validate user input**:  
  The task input field uses a regular expression to ensure that user entries are valid, preventing many special characters and enforcing a character limit.

- **Calculate and display data based on an external factor**:  
  The app uses the current date to calculate how many days remain until each task is due (e.g., “Due Today”, “Due in 2 days”, or “OVERDUE”).

- **Make a fetch request to an API and use the response**:  
  The calendar view fetches public holidays from the Nager.Date API and integrates them into the calendar alongside tasks.

- **Persist data and make it accessible after reload/refresh**:  
  Task data is stored using the browser's `localStorage` API. When the app loads, it reads saved tasks from `localStorage` and renders them automatically, ensuring that the user’s data remains intact across sessions and page reloads.

- **Implement modern interactive UI features**:  
  The app integrates multiple modern UI elements: a calendar-date-picker for setting task deadlines and a dynamic sort dropdown for sorting tasks by different criteria (due date, priority, creation).

---

### How to Run This Project

1. **Clone the Github repository.**
2. Open the entire project folder in VS Code.
3. Navigate to the project folder `capstone-tasklist`.
4. Run `npm install` in the terminal.
5. Open the `index.html` file in your browser to access the task list view using the Live Server Extension in VS Code.
6. Click the calendar icon in the header to navigate to the calendar view (`calendar.html`).
7. Click the list icon in the header to navigate back to the task list view and input form (`index.html`).
8. To see the full functionality:
   - Add a few tasks with different priorities and due dates.
   - View them in both list and calendar formats.
   - Ensure you are connected to the internet so the holiday data can be fetched from the API.
   - Test functionality of sorting the task list, deleting individual tasks, and marking tasks as completed.
   - In Calendar view, test functionality of viewing the day-list-view by selecting a day with tasks on it.

> Make sure that the file and folder structure stays intact and that you open the entire project folder in VS code (not just individual files). 

### Project Structure

- `index.html` – Main task list interface with input form for new tasks and the full task list
- `calendar.html` – Calendar view with holiday and task overlays and a day-list-view below  
- `js/main.js` – Task management logic  
- `js/calendar.js` – Calendar rendering and API integration  
- `css/styles.css` – Styling for both views
- `icons` - folder holding icon images for delete button and navigation
---





