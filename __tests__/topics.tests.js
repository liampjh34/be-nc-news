const app = require("../app");
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index')
const request = require("supertest");

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("/api/topics", () => {
  it("should get all available topics", async () => {
    const { body } = await request(app).get("/api/topics");
    console.log(body)
    expect(body.length).toBe(3);
  });
  it("should have a slug and description for each row", async () => {
    const { body } = await request(app).get("/api/topics");
    body.forEach((topic) => {
      expect(topic).toMatchObject({
        description: expect.any(String),
        slug: expect.any(String)
      })
    })
  })
  it('should return an error if no results', async () => {
    await db.query(`DELETE FROM comments;`)
    await db.query(`DELETE FROM articles;`)
    await db.query(`DELETE FROM topics;`)
    const { body } = await request(app).get("/api/topics");
    expect(body.status).toBe(404)
    expect(body.msg).toBe('No results found')
  });
});
