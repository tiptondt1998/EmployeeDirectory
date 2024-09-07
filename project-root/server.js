const express = require('express');  // Import the Express framework for building the web server
const bodyParser = require('body-parser');  // Middleware to parse form data
const sqlite3 = require('sqlite3').verbose();  // SQLite database driver
const path = require('path');  // Utility to work with file and directory paths

const app = express();  // Initialize an Express app
const port = 3000;  // Set the port number for the server

// Set up middleware to parse form data sent via POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Open a connection to the SQLite database named 'Employees.db'
const db = new sqlite3.Database('Employees.db');

// Ensure the 'employees' table exists in the database, create it if it doesn't
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    employeeID TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    position TEXT NOT NULL
  )`);
});

// Function to generate a unique alphanumeric ID for employees
const generateUniqueID = (length = 6) => {
  return new Promise((resolve, reject) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';  // Characters used to generate the ID
    let id = '';
    for (let i = 0; i < length; i++) {
      id += charset.charAt(Math.floor(Math.random() * charset.length));  // Randomly generate the ID
    }

    // Check if the generated ID is unique by querying the database
    db.get('SELECT 1 FROM employees WHERE employeeID = ?', [id], (err, row) => {
      if (err) return reject(err);  // If there's a database error, reject the promise
      if (row) {
        // If the ID already exists, recursively generate a new one
        resolve(generateUniqueID(length));
      } else {
        // If the ID is unique, resolve the promise with the generated ID
        resolve(id);
      }
    });
  });
};

// Route to handle form submission for adding a new employee
app.post('/add-employee', async (req, res) => {
  const { firstName, lastName, position } = req.body;  // Extract form data
  
  // Validate that all fields are provided
  if (!firstName || !lastName || !position) {
    return res.status(400).send('All fields are required');  // Return error if any field is missing
  }

  try {
    // Generate a unique employee ID
    const employeeID = await generateUniqueID();
    
    // Insert the new employee's data into the 'employees' table
    const query = 'INSERT INTO employees (employeeID, firstName, lastName, position) VALUES (?, ?, ?, ?)';
    db.run(query, [employeeID, firstName, lastName, position], (err) => {
      if (err) {
        return res.status(500).send('Database error: ' + err.message);  // Handle database errors
      }
      res.redirect('/');  // Redirect back to the homepage after successful submission
    });
  } catch (error) {
    res.status(500).send('Error generating employee ID: ' + error.message);  // Handle ID generation errors
  }
});

// Route to handle form submission for removing an employee by ID
app.post('/remove-employee', (req, res) => {
  const { employeeID } = req.body;  // Extract the employee ID from the form
  
  // Validate that the employee ID is provided
  if (!employeeID) {
    return res.status(400).send('Employee ID is required');  // Return error if missing
  }

  // Delete the employee from the 'employees' table based on the ID
  const query = 'DELETE FROM employees WHERE employeeID = ?';
  db.run(query, [employeeID], (err) => {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);  // Handle database errors
    }
    res.redirect('/');  // Redirect back to the homepage after successful deletion
  });
});

// Route to serve the list of all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';  // SQL query to select all employees
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);  // Handle database errors
    }
    res.json(rows);  // Send the result as a JSON response
  });
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'EmployeeDirectory.html'));  // Serve the EmployeeDirectory.html file
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);  // Log the server URL
});
