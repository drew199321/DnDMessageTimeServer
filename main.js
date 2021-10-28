require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/login', (req, res) => {
  // TODO: Check that user data was sent
  // TODO: Check user against known users and Auth user
  console.log(`user, ${req.query.username} logged in`); // TODO: log the failure as well

  const authData = { isAuthenticated: true, token: 'tokenData' }; // TODO: replace stub with actual auth system
  res.json(authData);
});

app.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on port ${process.env.WEB_PORT}.`);
});
