const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const sorted = require('jest-sorted')


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('/api/articles/:article_id/comments', () => {
    it('404: article not found', async () => {
        try {
            const { body } = await request(app)
            .get('/api/articles/34234234/comments')
            .expect(404)
            expect(body.msg).toBe('Article not found')
        } catch(error) {
            throw error
        }
    });
    it('400: not a number', async () => {
        try{
            const { body } = await request(app)
            .get('/api/articles/e/comments')
            .expect(400)
            expect(body.msg).toBe("Wrong data type")
        } catch(error) {
            throw error
        }
    });
    it('should return comments', async () => {
        try {
            const { body } = await request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            body.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
        } catch(error) {
            throw error
        }
    });
    it('should return comments ordered from most to least recent', async () => {
        try {
            const { body } = await request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            expect(body).toBeSortedBy('created_at', {
                descending: true
            })
        } catch(error) {
            throw error
        }
    });
});