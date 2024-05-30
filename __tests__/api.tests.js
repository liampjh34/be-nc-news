const request = require("supertest");
const app = require("../app");
const endpoints = require('../endpoints.json')
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("/api", () => {
  it('should return the endpoints', async () => {
    const { text } = await request(app).get("/api");
    const response = JSON.parse(text);
    expect(response).toEqual(endpoints)
  });
});
