const request = require('supertest');
const app = require('../app');
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

describe('GET /api/articles', () => {
    it('should return all articles', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        //should have a length check
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comments: expect.any(Number)
            })
        })
    });
    it('should return 0 comments for an article with no comments', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        body.articles.forEach((article) => {
            if (article.article_id === 2) {
                expect(article.comments).toBe(0)
            }
        })
    });
    it('should support sorting results by the author column', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        expect(body.articles).toBeSortedBy('author', {
            descending: true
        })
    });
    it('should support sorting results by the title', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        expect(body.articles).toBeSortedBy('title', {
            descending: true
        })
    });
    it('should support sorting results by the topic', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=topic')
        .expect(200)
        expect(body.articles).toBeSortedBy('topic', {
            descending: true
        })
    })
    it('should support sorting results by number of votes', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        expect(body.articles).toBeSortedBy('votes', {
            descending: true
        })
    });
    it('should support sorting results by number of comments', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=comments')
        .expect(200)
        expect(body.articles).toBeSortedBy('comments', {
            descending: true
        })
    })
    it('should 400 if an invalid sort is given', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=invalid_sort')
        .expect(400)
        expect(body.msg).toBe('Incorrect sort value')
    });
    it('uses created_at and descending order when given it as a desired order, and no sort_by is given', async () => {
        const { body } = await request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        expect(body.articles).toBeSortedBy('created_at', {
            descending: true
        })
    });
    it('uses created_at and ascending order when given it as a desired order, but no sort_by is given', async () => {
        const { body } = await request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        expect(body.articles).toBeSortedBy('created_at')
    });
    it('uses created_at and descending order by default when not given a desired order, and no sort_by is given', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        expect(body.articles).toBeSortedBy('created_at', {
            descending: true
        })
    });
    it('uses the desired sort value for sorting if given, and orders by DESC if no desired order is given', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        expect(body.articles).toBeSortedBy('author', {
            descending: true
        })
    });
    it('uses the desired sort value for sorting if given, and orders by DESC if given as a desired order', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=author&order=desc')
        .expect(200)
        expect(body.articles).toBeSortedBy('author', {
            descending: true
        })
    });
    it('uses the desired sort value for sorting if given, and orders by created_at ASC if given as a desired order', async () => {
        const { body } = await request(app)
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        expect(body.articles).toBeSortedBy('author')
    });
});

describe('GET /api/articles?query=aQuery', () => {
    it('should get queries by topic', async () => {
        const { body } = await request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        expect(body.articles.length).toBeGreaterThan(0)
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: 'cats',
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comments: expect.any(Number)
            })
        })
    });
    it('should return all articles if no topic is provided', async () => {
        const { body } = await request(app)
        .get('/api/articles')
        .expect(200)
        expect(body.articles.length).toBeGreaterThan(0)
        body.articles.forEach((article) => {
            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comments: expect.any(Number)
            })
        })
    });
    it('should return an empty list if the topic does not exist', async () => {
        const { body } = await request(app)
        //should be an error response if topic doesn't exist
        .get('/api/articles?topic=somethingWitty')
        .expect(200)
        expect(body.articles.length).toBe(0)
    });
    it('should return an empty list if the topic has no articles', async () => {
        const { body } = await request(app)
        .get('/api/articles?topic=Paper')
        .expect(200)
        expect(body.articles.length).toBe(0)
    });
});

describe('GET /api/articles/:article_id', () => {
    it('should return an article when given an ID', async () => {
        const { body } = await request(app)
        .get('/api/articles/2')
        //should be responding with { article: article}
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
    it('should return comment_count for an article', async () => {
        const { body } = await request(app)
        .get('/api/articles/2')
        .expect(200)
        expect(body).toMatchObject({
            comment_count: expect.any(Number)
        })
    });
    it('should 404 when article does not exist', async () => {
        const { body } = await request(app)
        .get('/api/articles/1423423')
        .expect(404)
        expect(body.msg).toBe('article not found')
    });
    it('should 400 when given a parametric ID that is NaN', async () => {
        const { body } = await request(app)
        .get('/api/articles/e')
        .expect(400)
        expect(body.msg).toBe('Wrong data type')
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('incrementing votes should respond with 200 and the updated article', async () => {
        //should also respond with {article: article}
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
    it('should 400 when trying to decrement a vote count that is already 0', async () => {
        const input = {
            inc_votes: 10
        }
        const { body } = await request(app)
        .patch('/api/articles/3')
        .send(input)
        .expect(400)
        expect(body.msg).toBe('Not allowed!')
    });
    it('should 400 if trying to decrement votes more than the vote count', async () => {
        const input = {
            inc_votes: 101
        }
        const { body } = await request(app)
        .patch('/api/articles/1')
        .send(input)
        .expect(400)
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