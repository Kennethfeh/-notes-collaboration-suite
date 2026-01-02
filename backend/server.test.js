const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { once } = require('node:events');
const { createApp } = require('./server');

const listen = async (t) => {
  const server = createApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  return request(server);
};

test('health endpoint works', async (t) => {
  const agent = await listen(t);
  const res = await agent.get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'healthy');
});

test('notes API creates notes', async (t) => {
  const agent = await listen(t);
  const createRes = await agent.post('/api/notes').send({ text: 'hello' });
  assert.equal(createRes.status, 201);
  const listRes = await agent.get('/api/notes');
  assert.ok(listRes.body.find((n) => n.text === 'hello'));
});
