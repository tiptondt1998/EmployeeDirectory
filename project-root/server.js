const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Open database connection
const db = new sqlite3.Database('Employees.db');

// Ensure employees table exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    employeeID TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    position TEXT NOT NULL
  )`);
});

// Handle form submission
app.post('/add-employee', (req, res) => {
  const { employeeID, firstName, lastName, position } = req.body;

  if (!employeeID || !firstName || !lastName || !position) {
    return res.status(400).send('All fields are required');
  }

  const query = 'INSERT INTO employees (employeeID, firstName, lastName, position) VALUES (?, ?, ?, ?)';
  db.run(query, [employeeID, firstName, lastName, position], (err) => {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);
    }
    res.redirect('/'); // Redirect back to the homepage
  });
});

// Serve employee list
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);
    }
    res.json(rows);
  });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'EmployeeDirectory.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
