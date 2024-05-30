const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/users', () => {
    it('should return the users and a 200', async () => {
        const { body } = await request(app)
        .get('/api/users')
        .expect(200)
        body.users.forEach((user) => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            })
        })
    });
});