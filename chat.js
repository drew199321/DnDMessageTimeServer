const uuidv4 = require('uuid').v4;

const messages = new Set();
const users = new Map();

/*
const savedMessages = [
  {
    messageId: '1',
    username: 'steve',
    messageType: 'brodcast',
    message: 'words words words',
    time: 'time',
  },
  {
    messageId: '2',
    username: 'bob',
    messageType: 'direct',
    message: 'words words words',
    time: 'time',
  },
  {
    messageId: '3',
    username: 'kevin',
    messageType: 'direct',
    message: 'words words words',
    time: 'time',
  },
  {
    messageId: '4',
    username: 'bob',
    messageType: 'direct',
    message: 'words words words',
    time: 'time',
  },
  {
    messageId: '5',
    username: 'steve',
    messageType: 'brodcast',
    message: 'words words words',
    time: 'time',
  },
];
*/

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (data) => this.handleMessage(data));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(data) {
    const message = {
      id: uuidv4(),
      username: users.get(this.socket).username,
      messageType: data.messageType,
      value: data.value,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);
  }

  disconnect() {
    users.delete(this.socket);
  }
}

async function authHandler(socket, next) {
  const { username, userType, token = null } = socket.handshake.query || {};
  if (token) {
    try {
      users.set(socket, {
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
    new Connection(io, socket);
  });
}

module.exports = chat;
