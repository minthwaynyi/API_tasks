// routes/data.js
const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../db');

// Helper to check JSON content-type
function ensureJSON(req, res) {
  const ct = req.headers['content-type'] || '';
  if (!ct.includes('application/json')) {
    res.status(415).json({ error: 'Unsupported Media Type. Use application/json' });
    return false;
  }
  return true;
}

// GET /data - return all
router.get('/', (req, res) => {
  const data = readData();
  res.json(data);
});

// GET /data/:id - return one by numeric id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const item = data.find(it => it.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST /data - create new
router.post('/', (req, res) => {
  if (!ensureJSON(req, res)) return;
  const payload = req.body;
  // Basic validation: require at least forename or surname
  if (!payload || (typeof payload !== 'object')) {
    return res.status(400).json({ error: 'Bad request body' });
  }

  const data = readData();
  // Find next id
  const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
  const newItem = { id: nextId, ...payload };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// DELETE /data/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const data = readData();
  const idx = data.findIndex(it => it.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  // splice one element at idx
  data.splice(idx, 1);
  writeData(data);
  // common pattern: return 204 No Content or 200 with deleted item. We'll return 200 with message.
  res.json({ message: 'Deleted', id });
});

// PUT /data/:id - idempotent: if exists update and return 200; if not create and return 201
router.put('/:id', (req, res) => {
  if (!ensureJSON(req, res)) return;
  const id = Number(req.params.id);
  const payload = req.body;
  if (!payload || (typeof payload !== 'object')) {
    return res.status(400).json({ error: 'Bad request body' });
  }

  const data = readData();
  const idx = data.findIndex(it => it.id === id);
  if (idx === -1) {
    // create new with specified id (to make PUT idempotent for provided id)
    const newItem = { id, ...payload };
    data.push(newItem);
    writeData(data);
    return res.status(201).json(newItem);
  } else {
    // update existing (replace fields but keep id)
    const updated = { ...data[idx], ...payload, id };
    data[idx] = updated;
    writeData(data);
    return res.status(200).json(updated);
  }
});

// POST /data/search
// Accepts body like { "forename": "Roy" } and returns matching objects
router.post('/search', (req, res) => {
  if (!ensureJSON(req, res)) return;
  const { forename } = req.body || {};
  if (!forename) return res.status(400).json({ error: 'forename required in body' });

  const data = readData();
  const matches = data.filter(item => {
    if (!item.forename) return false;
    return item.forename.toLowerCase() === String(forename).toLowerCase();
  });

  if (!matches.length) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(matches);
});

module.exports = router;
