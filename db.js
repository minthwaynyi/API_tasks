// db.js
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, 'data.json');

function readData() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readData, writeData };
