require('dotenv').config({ path: '.env' });
const express = require('express');
const mysql = require('mysql');

const app = express();

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

dbConnection.connect((err) => {
  if (err) {
    console.error(`Database connection failed:\n${err.stack}`);
    return;
  }
  console.log('Connected to database.');
});

app.get('/', (req, res) => {
  res.send('Test Message');
});

app.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on ${process.env.WEB_PORT}.`);
});
