const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Open database connection
const db = new sqlite3.Database('Employees.db');

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
    res.send('Employee added successfully');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
