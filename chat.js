const uuidv4 = require('uuid').v4;

const messages = new Set();
const newMessages = new Set();
const users = new Map();

// TODO: This is temp should be replaced with call to db
const savedMessages = [
  {
    id: '1',
    username: 'admin',
    messageType: 'brodcast',
    content: 'words words words',
    time: 'time',
  },
  {
    id: '2',
    username: 'member1',
    messageType: 'direct',
    content: 'member1',
    time: 'time',
  },
  {
    id: '3',
    username: 'member1',
    messageType: 'direct',
    content: 'member1',
    time: 'time',
  },
  {
    id: '4',
    username: 'member2',
    messageType: 'direct',
    content: 'member2',
    time: 'time',
  },
  {
    id: '5',
    username: 'admin',
    messageType: 'brodcast',
    content: 'words words words',
    time: 'time',
  },
];
savedMessages.forEach((message) => messages.add(message));

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
    messages.forEach((message) => {
      const user = users.get(this.socket);
      if (users.get(this.socket).userType === 'admin') {
        this.sendMessage(message);
      } else if (user.userType === 'member' && (message.messageType === 'brodcast' || message.username === user.username)) {
        this.sendMessage(message);
      }
    });
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
    newMessages.add(message);
    this.sendMessage(message);
  }

  disconnect() {
    users.delete(this.socket);
    if (users.size === 0) {
      console.log('Last user has disconected... now uploading to db');
      // TODO: Add all new messages to the db.
      console.log(newMessages);
    }
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
