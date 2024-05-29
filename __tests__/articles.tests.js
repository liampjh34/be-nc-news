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
    it('should return all articles', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        body.forEach((article) => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
            })
        })
    });
    it('should return 0 comments for an article with no comments', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        body.forEach((article) => {
            if (article.article_id === 2) {
                expect(article.comment_count).toBe(0)
            }
        })
    });
});

describe('/api/articles/:article_id', () => {
    it('should return an article when given an ID', async () => {
        const { body } = await request(app)
        .get('/api/articles/2')
        .expect(200)
        expect(body).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String)
        })
    });
    it('should 404 when no results are found', async () => {
        const { body } = await request(app)
        .get('/api/articles/999')
        .expect(404)
        expect(body.msg).toBe('No results found')
    });
});