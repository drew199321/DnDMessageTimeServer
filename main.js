require('dotenv').config({ path: '.env' });
const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: '50mb' }));
app.use(cors());

function authentication(data) {
  // TODO: replace stub with actual auth system
  console.log(`creating authentication using user data form ${data.username}`);
  const authToken = { isAuthenticated: true, token: 'tokenData' };
  return authToken;
}

// (B) WRITE TO FILE
fs.writeFile('demo.txt', 'CONTENT', 'utf8', (error, data) => {
  console.log('Write complete');
  console.log(error);
  console.log(data);
});

fs.readFile('demo.txt', 'utf8', (error, data) => {
  console.log('Read complete');
  console.log(error);
  console.log(data);
});

app.get('/login', (req, res) => {
  // Check that user data was sent
  console.log(req.query);
  if (req) { // TODO: Check that there is a username and password in query object and query object exits
    // TODO: Check file system for user with those username and password combo
    // TODO: check user is member of group as well
    console.log(`user, ${req.query.username} logged in`);
    res.json(authentication(req.query)).status(200);
  } else {
    console.log('Error: Credentials not recieved from client');
    res.json(authentication(req.query)).status(300); // TODO: should respond with isAuth as false and null for token
  }
});

app.post('/register', (req, res) => {
  console.log(req.body);
  // TODO: Check that user data was sent
  // TODO: If username exists respond with bad authentication
  // TODO: Register user in system
  // TODO: Register user with the group or create group if user is admin... there can only be one admin
  console.log(`user, ${req.body.username} registered`);
  res.json(authentication(req.body)).status(200);
});

server.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on port ${process.env.WEB_PORT}.`);
});
