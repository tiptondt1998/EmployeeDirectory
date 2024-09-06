// script.js

// Handle form submission
document.getElementById('addEmployee').addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const position = document.getElementById('position').value;

    const response = await fetch('/addEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, position }),
    });

    if (response.ok) {
        alert('Employee added successfully!');
        loadEmployees(); // Refresh the list
    } else {
        alert('Error adding employee');
    }
});

// Function to load employee data and display it
async function loadEmployees() {
    const response = await fetch('/employees');
    const employees = await response.json();

    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = '';  // Clear existing list

    employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = `${employee.firstName} ${employee.lastName} - ${employee.position}`;
        employeeList.appendChild(li);
    });
}

// Load employees on page load
window.onload = loadEmployees;
