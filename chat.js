const uuidv4 = require('uuid').v4;
const mysql = require('mysql');

const messages = new Set();
const newMessages = new Set();
const users = new Map();

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// TODO: May need to set up a pool
dbConnection.connect((err) => {
  if (err) {
    console.error(`Database connection failed:\n ${err.stack}`);
    return;
  }
  console.log('chatroom Connected to database.');
});

dbConnection.query(
  `SELECT msgid, time_of, content, type, username FROM messages
  JOIN users WHERE messages.userid = users.userid;`,
  (err, savedMesges) => {
    if (err) {
      console.error(`Failed to find user type: ${err.stack}\n`);
    }
    savedMesges.forEach((message) => {
      messages.add({
        id: message.msgid,
        username: message.username,
        time: message.time_of,
        content: message.content,
        type: message.type,
      });
    });
  },
);

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (data) => this.handleMessage(data));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => console.log(`connect_error due to ${err.message}`));
  }

  sendMessage(message) {
    console.log(message);
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    const user = users.get(this.socket);
    messages.forEach((message) => {
      console.log(message);
      if (users.get(this.socket).userType === 'admin') {
        this.io.sockets.emit('message', message);
      } else if (user.userType === 'member' && (message.type === 'brodcast' || message.username === user.username)) {
        this.io.sockets.emit('message', message);
      }
    });

  }

  handleMessage(data) {
    const message = {
      id: uuidv4(),
      userid: users.get(this.socket).userid,
      username: users.get(this.socket).username,
      type: data.type,
      content: data.value,
      time: Date.now(),
    };

    messages.add(message);
    newMessages.add(message);
    this.sendMessage(message);
  }

  disconnect() {
    users.delete(this.socket);
    if (users.size === 0) {
      console.log('Last user has disconected... now uploading to db');
      newMessages.forEach((message) => {
        dbConnection.query(
          'INSERT INTO messages VALUES (?, ?, ?, ?, ?)',
          [message.id, message.userid, new Date(message.time), message.content, message.type],
          (err) => {
            if (err) {
              console.error(`Failed to upload message: ${err.stack}\n`);
            }
          },
        );
      });
      newMessages.clear();
    }
  }
}

// TODO: Should check authToken before connection
async function authHandler(socket, next) {
  const {
    username,
    userType,
    userid,
    token = null,
  } = socket.handshake.query || {};
  if (token) {
    try {
      users.set(socket, {
        userid,
        userType,
        username,
      });
    } catch (error) {
      console.log(error);
    }
  }
  next();
}

function chat(io) {
  io.use(authHandler);
  io.on('connection', (socket) => {
    // eslint-disable-next-line no-new
    console.log('Socket connection established');
    console.log(socket);
    new Connection(io, socket);
  });
  io.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`)
  });
}

module.exports = chat;
