// tests/data-search.test.js
const request = require('supertest');
const app = require('../app');
const { writeData } = require('../db');

describe('POST /data/search', () => {
  beforeAll(() => {
    // prepare test data (overwrite data.json)
    writeData([
      { id: 1, forename: 'Roy', surname: 'Fielding' },
      { id: 2, forename: 'Roy', surname: 'Other' },
      { id: 3, forename: 'Alice', surname: 'Smith' }
    ]);
  });

  it('returns matches when forename exists', async () => {
    const res = await request(app)
      .post('/data/search')
      .set('Content-Type', 'application/json')
      .send({ forename: 'Roy' });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('forename', 'Roy');
  });

  it('returns 404 when forename not found', async () => {
    const res = await request(app)
      .post('/data/search')
      .set('Content-Type', 'application/json')
      .send({ forename: 'Nonexistent' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  it('returns 400 when request missing forename', async () => {
    const res = await request(app)
      .post('/data/search')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('returns 415 when content-type not application/json', async () => {
    const res = await request(app)
      .post('/data/search')
      .set('Content-Type', 'text/plain')
      .send(JSON.stringify({ forename: 'Roy' }));

    expect(res.statusCode).toBe(415);
  });
});
