// Waits until the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // Calls the function to fetch and display the employee list once the page is ready
  fetchEmployeeList();
});

// Function to fetch the employee list from the server
function fetchEmployeeList() {
  // Sends a GET request to the '/employees' endpoint to retrieve employee data
  fetch('/employees')
    .then(response => response.json())  // Parses the JSON response from the server
    .then(data => {
      // Selects the div where the employee list will be displayed
      const list = document.getElementById('employee-list');
      // Clears any existing content in the employee list div
      list.innerHTML = '';
      // Iterates through each employee object in the data array
      data.forEach(employee => {
        // Creates a new div element to hold the employee's information
        const div = document.createElement('div');
        // Sets the text content of the div to display the employee's ID, name, and position
        div.textContent = `ID: ${employee.employeeID}, Name: ${employee.firstName} ${employee.lastName}, Position: ${employee.position}`;
        // Appends the div to the employee list in the HTML document
        list.appendChild(div);
      });
    })
    .catch(error => console.error('Error fetching employee list:', error));  // Logs an error if the request fails
}
