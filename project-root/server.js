// server.js
const express = require('express');
const db = require('./database'); // Import the database
const app = express();
const PORT = 3000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/JS files
app.use(express.static(__dirname + '/public'));

// Route to add an employee to the database
app.post('/addEmployee', (req, res) => {
    const { firstName, lastName, position } = req.body;
    const sql = 'INSERT INTO Employees (firstName, lastName, position) VALUES (?, ?, ?)';

    db.run(sql, [firstName, lastName, position], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error adding employee');
        } else {
            res.status(200).send(`Employee added with ID: ${this.lastID}`);
        }
    });
});

// Route to fetch all employees
app.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM Employees';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving employees');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
