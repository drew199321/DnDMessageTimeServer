require('dotenv').config({ path: '.env' });
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const http = require('http');
const cors = require('cors');
// const fs = require('fs');
const chat = require('./chat');

const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// TODO: May need to open and close the connection for each call
dbConnection.connect((err) => {
  if (err) {
    console.error(`Database connection failed:\n ${err.stack}`);
    return;
  }
  console.log('Connected to database.');
});
/*
function writeToFile(data) {
  fs.appendFile('demo.txt', data + os.EOL, 'utf8', (error) => {
    console.log('Write complete');
    console.log('Error: %s', error);
    console.log('Data written: %s', data);
  });
}
*/
function authentication(data) {
  // TODO: replace stub with actual auth system
  console.log(`creating authentication using user data form ${data.username}`);
  return {
    isAuthenticated: true,
    token: 'tokenData',
    userType: data.userType,
    username: data.username,
  }; // TODO: If admin send that back
}

app.get('/login', (req, res) => {
  // TODO: Hack change nested queries to promises
  console.log(req.query);
  if (req.query.username && req.query.password) {
    dbConnection.query('select username from users', (err, result) => {
      if (err) {
        console.error(`Failed to check usernames: ${err.stack}\n`);
      }
      if (JSON.stringify(result).includes(`"username":"${req.query.username}"`)) {
        console.log(`Username ${req.query.username} found`);
        dbConnection.query(`select passwrd from users where username = '${req.query.username}'`, (err2, result2) => {
          if (err2) {
            console.error(`Failed to check password: ${err.stack}\n`);
          }
          if (JSON.stringify(result2).includes(`"passwrd":"${req.query.password}"`)) {
            console.log('User Confirmed');
            dbConnection.query(`select usertype from users where username = '${req.query.username}'`, (err3, result3) => {
              if (err3) {
                console.error(`Failed to append user type: ${err.stack}\n`);
              }
              const throwObject = Object.assign(req.query, result3);
              console.log(throwObject);
              res.json(authentication(throwObject)).status(300);
            });
          } else {
            console.log('Bad Password');
            res.json({}).status(300);
          }
        });
      } else {
        console.log('Login Error');
        res.json({}).status(300);
      }
    });
  } else {
    console.log('Error: Credentials not recieved from client');
    res.json({}).status(300); // TODO: should respond with isAuth as false and null for token
  }
});

function userEntry(data) {
  dbConnection.query(`
  insert into users( username, passwrd, usertype)
  values (
    '${data.username}',
    '${data.password}',
    '${data.userType}')`, (err) => {
    if (err) {
      console.error(`Failed to write to DB: ${err.stack}\n`);
    }
    console.log('User info recorded to database');
    console.log(`user, ${data.username} registered`);
    return authentication(data);
  });
}

app.post('/register', (req, res) => {
  // TODO: Hack change nested queries to promises
  if (req.body.username && req.body.password && req.body.userType) {
    dbConnection.query('select username from users', (err, result) => {
      if (err) {
        console.error(`Failed to check usernames: ${err.stack}\n`);
      }
      if (JSON.stringify(result).includes(`"username":"${req.body.username}"`)) {
        console.log(`Error: Username ${req.body.username} already exists in database`);
        res.json({}).status(300);
      } else if (req.body.userType === 'admin') {
        dbConnection.query('select usertype from users', (err2, result2) => {
          if (err2) {
            console.error(`Failed to check admin: ${err.stack}\n`);
          }
          if (JSON.stringify(result2).includes('"usertype":0')) {
            console.log('Error: Admin already exists');
            res.json({}).status(300);
          } else {
            res.json(userEntry(req.body)).status(200);
          }
        });
      } else {
        res.json(userEntry(req.body)).status(200);
      }
    });
  } else {
    console.log('Error: Credentials not recieved from client');
    res.json(authentication(req.query)).status(300);
  }
});

const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
chat(io);

server.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on port ${process.env.WEB_PORT}.`);
});
