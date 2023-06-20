const express = require('express');
const mysql = require('mysql2');

const app = express();

app.get('/', (req, res) => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect(value => {
    connection.query('SELECT * FROM employee', (error, results) => {
      if (error) {
        res.status(500).send('Error executing MySQL query');
        return;
      }
      res.json(results);
    });

    connection.end();
  });
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
