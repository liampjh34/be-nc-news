const request = require("supertest");
const app = require("../app");

describe("getApi()", () => {
  it("should return a 200 for /api", async () => {
    const { text, statusCode } = await request(app).get("/api");
    const response = JSON.parse(text);
    expect(statusCode).toBe(200);
  });

  it('should only contain objects representing each endpoint', async () => {
    const { text, statusCode } = await request(app).get("/api");
    const response = JSON.parse(text);
    for (endpoint in response) {
      expect(typeof response[endpoint]).toBe('object');
    }
  });

  it("should detail the keys of each endpoint", async () => {
    const { text, statusCode } = await request(app).get("/api");
    const response = JSON.parse(text);

    for (endpoint in response) {
      const queriesArray = response[endpoint].queries.map((query) => {
        return query;
      });

      expect(response[endpoint]).toMatchObject({
        description: expect.any(String),
        // queries is checked in the test below, so we can check an array is returned
        exampleResponse: expect.any(Object),
      });
    }
  });

  it(`should return an array for each endpoints' queries`, async () => {
    const { text, statusCode } = await request(app).get("/api");
    const response = JSON.parse(text);
    for (endpoint in response) {
      expect(Array.isArray(response[endpoint].queries)).toBe(true);
    }
  });
});
