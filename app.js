// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskButton = document.getElementById('task-button');  // Tombol untuk Add/Save task
const taskList = document.getElementById('task-list');
const taskCountEl = document.getElementById('task-count');
const errorMessage = document.getElementById('error-message');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
    updateTaskCount();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editingTaskId) {
        updateTask(editingTaskId);
    } else {
        addTask();
    }
});

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    // Simple validation
    if (taskText === '') {
        errorMessage.classList.remove('d-none');
        return;
    }

    // Clear error message
    errorMessage.classList.add('d-none');

    const task = {
        id: generateID(),
        text: taskText,
        completed: false,
    };

    tasks.push(task);
    updateLocalStorage();
    displayTasks();
    updateTaskCount();

    // Clear input
    taskInput.value = '';
}

// Generate a random ID
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Display all tasks
function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.classList.add('text-decoration-line-through');
        }
        li.appendChild(taskText);

        const buttonGroup = document.createElement('div');

        // Complete Task Button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.classList.add('btn', task.completed ? 'btn-warning' : 'btn-success', 'btn-sm', 'me-2');
        completeBtn.addEventListener('click', () => toggleTaskCompleted(task.id));
        buttonGroup.appendChild(completeBtn);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
        editBtn.addEventListener('click', () => loadTaskToEdit(task.id));
        buttonGroup.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(buttonGroup);
        taskList.appendChild(li);
    });
}

// Load task to edit
function loadTaskToEdit(taskId) {
    const taskToEdit = tasks.find(task => task.id === taskId);
    taskInput.value = taskToEdit.text;
    editingTaskId = taskId;

    // Ubah teks tombol menjadi 'Save'
    taskButton.textContent = 'Save';
}

// Update task
function updateTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.text = taskInput.value.trim();
        }
        return task;
    });

    updateLocalStorage();
    displayTasks();
    taskInput.value = '';
    editingTaskId = null; // Reset editing ID

    taskButton.textContent = 'Add Task';
}
// Toggle task completion
function toggleTaskCompleted(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    updateLocalStorage();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    // localStorage.removeItem('tasks'); //! localStorage.removeItem tidak bisa digunakan, karna akan remove semua task
    tasks = tasks.filter(task => task.id !== id); // Hapus task berdasarkan ID
    updateLocalStorage();
    displayTasks();
    updateTaskCount();
}

// Update task count
function updateTaskCount() {
    taskCountEl.textContent = tasks.length;
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); //! store task to localStorage as string coz localStorage hanya menyimpan data dalam bentuk string 
}