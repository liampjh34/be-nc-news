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

describe('/api/articles', () => {
    it('should return an article when given an ID', async () => {
        const { body } = await request(app)
        .get('/api/articles/2')
        .expect(200)
        expect(body.length).toBe(1)
    });
    it('should 400 when no results are found', async () => {
        const { body } = await request(app)
        .get('/api/articles/999')
        .expect(400)
        expect(body.msg).toBe('No results found')
    });
});