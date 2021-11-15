const uuidv4 = require('uuid').v4;

const messages = new Set();
const users = new Map();

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (data) => this.handleMessage(data)); // TODO: data should be returned to value
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

  handleMessage(data) { // TODO: data should be returned to value
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || data.username, // TODO: || statment should be removed
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

/*
function setUser(socket, next) {
  users.set(socket, {
    user: 'person', // TODO: should be given when user connects
  });
  next();
}
*/

function chat(io) {
  // io.use(setUser);
  io.on('connection', (socket) => {
    // eslint-disable-next-line no-new
    new Connection(io, socket);
  });
}

module.exports = chat;
