// Define UI Vars
const form = document.querySelector("#task-form");
const formbtn = document.querySelector(".formbtn");
const taskInput = document.querySelector("#task");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector("#clear-btn");

let editElement = null;
let originalTask = null;

loadEventListeners();

function loadEventListeners() {
    // DOM LOAD EVENT
    document.addEventListener("DOMContentLoaded", getTasks);

    // Add Task Event
    form.addEventListener("submit", checkAddOrUpdate);

    // Clear Task Event
    clearBtn.addEventListener("click", clearTasks);

    // Remove Task
    taskList.addEventListener("click", removeTask);

    // Edit Task
    taskList.addEventListener("click", initiateEditTask);
}

// Function to check whether to add or update a task
function checkAddOrUpdate(e) {
    e.preventDefault();
    if (formbtn.value === "Update") {
        updateTask();
    } else {
        addTask();
    }
}

// Initiate task editing
function initiateEditTask(e) {
    if (e.target.parentElement.classList.contains("edit-item")) {
        if (confirm("Do you want to edit this task?")) {
            // Store the original task text for localStorage update
            originalTask = e.target.parentElement.parentElement.firstChild.textContent;

            // Set the input field with the current task's value
            taskInput.value = originalTask;

            // Change the button text to "Update"
            formbtn.value = "Update";

            // Store the current task list item for updating later
            editElement = e.target.parentElement.parentElement;
        }
    }
}

// Update an existing task
function updateTask() {
    if (editElement) {
        // Keep the icons (delete & edit) intact
        const iconsHTML = editElement.innerHTML.match(/<a.*<\/a>/g); // Extract the icons' HTML

        // Update the task text
        editElement.innerHTML = taskInput.value + (iconsHTML ? iconsHTML.join('') : "");

        // Update localStorage with the new task value
        updateTaskInLocalStorage(originalTask, taskInput.value);

        // Reset form and variables
        formbtn.value = "Add Task";
        taskInput.value = "";
        editElement = null;
        originalTask = null;
    }
}

// Fetch tasks from localStorage and display them
function getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.forEach(function (task) {
        createLi(task);
    });
}

// Add a new task
function addTask() {
    // Validation
    if (taskInput.value === "") {
        alert("Please fill in the task");
    } else {
        createLi(taskInput.value);
        storeTaskInLocalStorage(taskInput.value);
        taskInput.value = ""; // Clear input after adding
    }
}

// Remove task from DOM and localStorage
function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstChild.textContent);
        }
    }
}

// Store task in localStorage
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task in localStorage
function updateTaskInLocalStorage(original, updated) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(function (task, index) {
        if (task === original) {
            tasks[index] = updated;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    tasks.forEach(function (task, index) {
        if (task === taskText) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear all tasks from DOM and localStorage
function clearTasks() {
    taskList.innerHTML = "";
    clearTasksFromLocalStorage();
}

// Clear tasks from localStorage
function clearTasksFromLocalStorage() {
    localStorage.removeItem("tasks");
}

// Create task list item and append it to the task list
function createLi(value) {
    const li = document.createElement("li");

    // Add class to li
    li.className = "collection-item";

    // Set the task text
    li.appendChild(document.createTextNode(value));

    // Create delete element
    const del = document.createElement("a");
    del.className = "delete-item secondary-content";
    del.innerHTML = `<i class="fa fa-remove"></i>`;

    // Create edit element
    const edit = document.createElement("a");
    edit.className = "edit-item secondary-content";
    edit.innerHTML = `<i class="fa fa-edit"></i>`;

    // Append delete and edit to li
    li.appendChild(del);
    li.appendChild(edit);

    // Append li to task list
    taskList.appendChild(li);
}