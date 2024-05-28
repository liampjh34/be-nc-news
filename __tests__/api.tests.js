const request = require("supertest");
const app = require("../app");
const endpoints = require('../endpoints.json')

describe("/api", () => {
  it('should return the endpoints', async () => {
    const { text, statusCode } = await request(app).get("/api");
    const response = JSON.parse(text);
    expect(response).toEqual(endpoints)
  });
});
