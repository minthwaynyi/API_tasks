// app.js
const express = require('express');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3000;

// parse JSON bodies
app.use(bodyParser.json());

// mount routes for /data
app.use('/data', dataRoutes);

// basic root
app.get('/', (req, res) => {
  res.send('Simple Data API is running. Use /data');
});

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app; // for tests
