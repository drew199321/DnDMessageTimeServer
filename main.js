require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

function authentication(data) {
  // TODO: replace stub with actual auth system
  console.log(`creating authentication using user data form ${data.username}`);
  const authToken = { isAuthenticated: true, token: 'tokenData' };
  return authToken;
}

app.get('/login', (req, res) => {
  // Check that user data was sent
  if (req) {
    console.log(`user, ${req.query.username} logged in`);
    res.json(authentication(req.query)).status(200);
  } else {
    console.log('Error: Credentials not recieved from client');
    res.json(authentication(req.query)).status(300);
  }
});

app.post('/register', (req, res) => {
  // TODO: Check that user data was sent
  // TODO: Register user in system
  // TODO: If username exists respond with bad authentication
  console.log(`user, ${req.body.username} registered`);
  res.json(authentication(req.body)).status(200);
});

app.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on port ${process.env.WEB_PORT}.`);
});
