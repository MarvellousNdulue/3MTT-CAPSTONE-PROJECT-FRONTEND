const BASE_URL = "http://localhost:8080";

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        console.log("Login Data:", { email, password }); // Log data to check
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => { return { message: "Unknown error" }; });
            throw new Error(errorData.message || "Invalid credentials");
        }

        const data = await response.json();
        localStorage.setItem("jwtToken", data.token); // Store token
        window.location.href = "index.html"; // Redirect to home
    } catch (error) {
        alert(`Login failed: ${error.message}`);
    }
}

// Function to handle the signup form submission
async function handleSignup(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input values from the form
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    // Simulate user registration (This is a placeholder for real backend logic)
    if (name && email && password) {
        console.log('User Registered:', { name, email }); // Log the user data (for debugging)

        try {
            // Simulate sending a POST request to a server
            const response = await fetch('https://mockapi.example.com/signup', {
                method: 'POST', // HTTP method for sending data
                headers: {
                    'Content-Type': 'application/json', // Specify the content type
                },
                body: JSON.stringify({
                    name, // Data sent to the server
                    email,
                    password,
                }),
            });

            // Parse the server response
            const data = await response.json();

            if (response.ok) {
                console.log('Server Response:', data); // Log the response for debugging
                alert('Registration successful! Redirecting to login page...');
                window.location.href = 'login.html'; // Redirect to the login page
            } else {
                // Handle server errors
                alert(`Error: ${data.message || 'Unable to register. Please try again!'}`);
            }
        } catch (error) {
            // Handle network errors
            alert('Network error. Please check your connection and try again!');
            console.error('Error:', error);
        }
    } else {
        alert('Please fill in all the fields!');
    }
}

// Fetch tasks
async function fetchTasks() {
    const jwtToken = localStorage.getItem("jwtToken");
    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => { return { message: "Unknown error" }; });
            throw new Error(errorData.message || "Failed to fetch tasks");
        }

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        alert(`Error fetching tasks: ${error.message}`);
    }
}

// Render tasks to the UI
function renderTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline}</td>
            <td>${task.priority}</td>
            <td>
                <button onclick="deleteTask('${task._id}')">Delete</button>
                <button onclick="editTask('${task._id}')">Edit</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// Add new task
async function addTask(event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ title, description, deadline, priority }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => { return { message: "Unknown error" }; });
            throw new Error(errorData.message || "Failed to add task");
        }

        fetchTasks();
        document.getElementById("task-form").reset();
    } catch (error) {
        alert(`Error adding task: ${error.message}`);
    }
}

// Delete task
async function deleteTask(taskId) {
    const jwtToken = localStorage.getItem("jwtToken");
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwtToken}` },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => { return { message: "Unknown error" }; });
            throw new Error(errorData.message || "Failed to delete task");
        }

        fetchTasks();
    } catch (error) {
        alert(`Error deleting task: ${error.message}`);
    }
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        fetchTasks();
        document.getElementById("task-form").addEventListener("submit", addTask);
    }
});

// Toggle Password Visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === "password" ? "text" : "password";
}
