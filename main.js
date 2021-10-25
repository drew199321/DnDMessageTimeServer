require('dotenv').config({ path: '.env' });
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Test Message');
});

app.listen(process.env.WEB_PORT, () => {
  console.log(`Server is listning on port ${process.env.WEB_PORT}.`);
});
