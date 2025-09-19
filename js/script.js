let todos =[];
let currentFilter = 'all';
let editingIndex = -1;

/// Load todos from localStorage
window.addEventListener('DOMContentLoaded', function() {
            loadTodo();
            displayTodo();
            updateTodoCount();
        });

// Set today's date as default
    document.getElementById("todo-date").value = new Date().toISOString().split('T')[0];

function addTodo(event) {
        event.preventDefault();

    ///Get input values
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");

    if(validateInput(todoInput.value, todoDate.value)){
        if (editingIndex >= 0) {
            // Update existing todo
            todos[editingIndex] = {
                id: todos[editingIndex].id,
                task: todoInput.value,
                date: todoDate.value,
                completed: todos[editingIndex].completed
                };
                editingIndex = -1;
                document.querySelector('button[type="submit"]').innerHTML = '<i class="uil uil-plus mr-2"></i>Add Todo';
            } else {
                    //Add to todos array
                    const formtodo = {id: Date.now(), 
                                    task: todoInput.value, 
                                    date: todoDate.value, 
                                    completed: false};
                    todos.push(formtodo);
            }

        saveTodo();    
        displayTodo();
        updateTodoCount();    

        //Clear input fields
        todoInput.value = "";
        todoDate.value = new Date().toISOString().split('T')[0];
        todoInput.focus();
    }
}


function displayTodo(){
    ///Clear existing list
    const todoList = document.getElementById("todo-list");
    const emptyState = document.getElementById("empty-state");

    // Filter todos based on current filter
            let filteredTodo = todos;
            if (currentFilter === 'completed') {
                filteredTodo = todos.filter(todo => todo.completed);
            } else if (currentFilter === 'uncompleted') {
                filteredTodo = todos.filter(todo => !todo.completed);
            }

            // Clear existing list
            todoList.innerHTML = "";

            if (filteredTodo.length === 0) {
                todoList.innerHTML = "";
                emptyState.style.display = "block";
                return;
            }

            emptyState.style.display = "none";

            filteredTodo.forEach((todo, index) => {
                const originalIndex = todos.findIndex(t => t.id === todo.id);
                const li = document.createElement('li');
                li.className = `task ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <label>
                        <input 
                            type="checkbox" 
                            ${todo.completed ? 'checked' : ''} 
                            onchange="toggleTodo(${originalIndex})"
                        > 
                        <span class="task-text">${todo.task}</span>
                        <span class="text-sm text-gray-500 ml-2">${formatDate(todo.date)}</span>
                    </label>
                    <div class="settings">
                        <i class="uil uil-ellipsis-h" onclick="toggleMenu(${originalIndex})"></i>
                        <ul class="task-menu" id="menu-${originalIndex}">
                            <li onclick="editTodo(${originalIndex})">
                                <i class="uil uil-pen"></i>Edit
                            </li>
                            <li onclick="deleteTodo(${originalIndex})">
                                <i class="uil uil-trash"></i>Delete
                            </li>
                        </ul>
                    </div>
                `;
                todoList.appendChild(li);
            });
        }

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodo();
    displayTodo();
    updateTodoCount();
 }

function editTodo(index) {
    const todo = todos[index];
    document.getElementById("todo-input").value = todo.task;
    document.getElementById("todo-date").value = todo.date;
    document.querySelector('button[type="submit"]').innerHTML = '<i class="uil uil-check mr-2"></i>Update Todo';
    editingIndex = index;
    document.getElementById("todo-input").focus();
    closeAllMenus();
}

function deleteTodo(index) {
    if (confirm('Are you sure you want to delete this task?')) {
    todos.splice(index, 1);
    saveTodo();
    displayTodo();
    updateTodoCount();
    }
    closeAllMenus();
}

function clearallTodo(){
    console.log("clearallTodo called");
    if (todos.length === 0) {
            alert("No tasks to clear!");
            return;
        }
    if (confirm('Are you sure you want to clear all tasks?')) {
            todos = [];
            saveTodo();
            displayTodo();
            updateTodoCount();
        }
}

function filterTodo(filter){
    currentFilter = filter;
            
        // Update active filter button
        document.querySelectorAll('.filters span').forEach(span => {
            span.classList.remove('active');
        });
        document.getElementById(filter).classList.add('active');
        displayTodo();
}

function toggleMenu(index) {
    closeAllMenus();
    const menu = document.getElementById(`menu-${index}`);
    if (menu) {
                menu.classList.add('show');
            }
}

function closeAllMenus() {
    document.querySelectorAll('.task-menu').forEach(menu => {
    menu.classList.remove('show');
    });
}

function validateInput(task, date){
    ///Simple validation
     if (task.trim() === "") {
                alert("Please enter a task!");
                document.getElementById("todo-input").focus();
                return false;
            }
            if (date === "") {
                alert("Please select a date!");
                document.getElementById("todo-date").focus();
                return false;
            }
            return true;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateTodoCount() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const countElement = document.getElementById("todo-count");
            
        if (totalTasks === 0) {
            countElement.textContent = "0 tasks";
        } else {
            countElement.textContent = `${totalTasks} tasks (${completedTasks} completed)`;
        }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function saveTodo() {
    // Store in memory only (localStorage not available in Claude artifacts)
    // In a real application, you would use: localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodo() {
    // Load from memory only (localStorage not available in Claude artifacts)
    // In a real application, you would use: 
    // const savedTodos = localStorage.getItem('todos');
    // if (savedTodos) todos = JSON.parse(savedTodos);
}

// Close menus when clicking outside
    document.addEventListener('click', function(event) {
    if (!event.target.closest('.settings')) {
    closeAllMenus();
    }
});

// Cancel edit mode when pressing Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && editingIndex >= 0) {
            editingIndex = -1;
            document.getElementById("todo-input").value = "";
            document.getElementById("todo-date").value = new Date().toISOString().split('T')[0];;
            document.querySelector('button[type="submit"]').innerHTML = '<i class="uil uil-plus mr-2"></i>Add Todo';
        }
    });

// Set today's date as default
    // document.getElementById("todo-date").value = new Date().toISOString().split('T')[0];
