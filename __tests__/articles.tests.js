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

describe('GET /api/articles', () => {
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

describe('GET /api/articles/:article_id', () => {
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

describe('PATCH /api/articles/:article_id', () => {
    it('decrementing votes should respond with 200 and the updated article', async () => {
        const input = {
            inc_votes: 1
        }
        const { body } = await request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(200)
        expect(body[0]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 101,
            article_img_url: expect.any(String)
        })
    });
    it('decrementing votes should respond with 200 and the updated article', async () => {
        const input = {
            inc_votes: -10
        }
        const { body } = await request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(200)
        expect(body[0]).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 90,
            article_img_url: expect.any(String)
        })
    });
    it('should 403 when trying to decrement a vote count that is already 0', async () => {
        const input = {
            inc_votes: 10
        }
        const { body } = await request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(403)
        expect(body.msg).toBe('Not allowed!')
    });
    it('should 403 if trying to decrement votes more than the vote count', async () => {
        const input = {
            inc_votes: 101
        }
        const { body } = await request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(403)
        expect(body.msg).toBe('Not allowed!')
    });
    it('should 404 for an article that does not exist', async () => {
        const input = {
            inc_votes: 101
        }
        const { body } = await request(app)
        .patch('/api/articles/1423423')
        .send(input)
        .expect(404)
        expect(body.msg).toBe('Article not found')
    });
    it('should 400 when parametric ID is NaN', async () => {
        const input = {
            inc_votes: 101
        }
        const { body } = await request(app)
        .patch('/api/articles/e')
        .send(input)
        .expect(400)
        expect(body.msg).toBe('Wrong data type')
    });
});