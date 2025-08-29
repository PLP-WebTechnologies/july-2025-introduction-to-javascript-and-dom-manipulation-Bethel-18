// ==================== PART 1: VARIABLES, CONDITIONALS, AND BASIC OPERATIONS ====================

// Variable declarations
let tasks = []; // Array to store task objects
let currentFilter = 'all'; // Track current filter: 'all', 'active', 'completed'

// DOM element references
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const showAllBtn = document.getElementById('showAll');
const showActiveBtn = document.getElementById('showActive');
const showCompletedBtn = document.getElementById('showCompleted');

// ==================== PART 2: FUNCTIONS ====================

/**
 * Function to add a new task
 * @param {string} text - The text of the task to add
 * @returns {void}
 */
function addTask(text) {
    // Input validation using conditionals
    if (!text.trim()) {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: text.trim(),
        completed: false,
        date: new Date().toLocaleString() // Add creation date
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Update UI
    renderTasks();
    updateStats();
    
    // Clear input
    taskInput.value = '';
}

/**
 * Function to format task text with proper capitalization
 * @param {string} text - The text to format
 * @returns {string} - The formatted text
 */
function formatTaskText(text) {
    // Check if text is empty
    if (!text) return '';
    
    // Capitalize first letter and make the rest lowercase
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ==================== PART 3: LOOPS ====================

/**
 * Function to render tasks based on current filter
 * Uses forEach loop to iterate through tasks
 */
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    // Hide empty state
    emptyState.classList.add('hidden');
    
    // Counter for visible tasks
    let visibleTasks = 0;
    
    // Loop through all tasks using forEach
    tasks.forEach(task => {
        // Apply filter using conditionals
        if (currentFilter === 'active' && task.completed) return;
        if (currentFilter === 'completed' && !task.completed) return;
        
        visibleTasks++;
        
        // Create task element
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        // Add HTML content
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${formatTaskText(task.text)}</span>
            <small>${task.date}</small>
            <button class="task-delete">×</button>
        `;
        
        // Add to list
        taskList.appendChild(li);
    });
    
    // Show empty state for current filter if no visible tasks
    if (visibleTasks === 0) {
        const emptyFilterState = document.createElement('li');
        emptyFilterState.className = 'empty-state';
        emptyFilterState.textContent = 
            currentFilter === 'active' ? 'No active tasks!' : 
            currentFilter === 'completed' ? 'No completed tasks!' : 'No tasks yet!';
        taskList.appendChild(emptyFilterState);
    }
}

/**
 * Function to update task statistics
 * Uses for loop to count tasks
 */
function updateStats() {
    let total = tasks.length;
    let completed = 0;
    
    // Count completed tasks using a for loop
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        }
    }
    
    // Update DOM
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
}

// ==================== PART 4: DOM MANIPULATION ====================

// Event listener for adding a task
addTaskBtn.addEventListener('click', () => {
    addTask(taskInput.value);
});

// Event listener for Enter key in input field
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

// Event delegation for task interactions (checking and deleting)
taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    // Toggle completion status
    if (e.target.classList.contains('task-checkbox')) {
        // Find task in array
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = e.target.checked;
            taskItem.classList.toggle('completed');
            updateStats();
        }
    }
    
    // Delete task
    if (e.target.classList.contains('task-delete')) {
        // Remove task from array
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Update UI
        renderTasks();
        updateStats();
    }
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', () => {
    // Filter out completed tasks
    tasks = tasks.filter(task => !task.completed);
    
    // Update UI
    renderTasks();
    updateStats();
});

// Filter buttons event listeners
showAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    updateActiveFilterButton(showAllBtn);
    renderTasks();
});

showActiveBtn.addEventListener('click', () => {
    currentFilter = 'active';
    updateActiveFilterButton(showActiveBtn);
    renderTasks();
});

showCompletedBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    updateActiveFilterButton(showCompletedBtn);
    renderTasks();
});

// Helper function to update active filter button
function updateActiveFilterButton(activeButton) {
    // Remove active class from all filter buttons
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    activeButton.classList.add('active');
}

// Initialize the application
function initApp() {
    // Load any saved tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks;
        renderTasks();
        updateStats();
    }
}

// Save tasks to localStorage before page unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
});

// Initialize the app
initApp();
