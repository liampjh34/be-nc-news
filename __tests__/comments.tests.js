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

describe('GET /api/articles/:article_id/comments', () => {
    it('404: article not found', async () => {
            const { body } = await request(app)
            .get('/api/articles/34234234/comments')
            .expect(404)
            expect(body.msg).toBe('Article not found')
    });
    it('400: not a number', async () => {
            const { body } = await request(app)
            .get('/api/articles/e/comments')
            .expect(400)
            expect(body.msg).toBe("Wrong data type")
    });
    it('should return comments', async () => {
            const { body } = await request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            expect(body.comments.length).toBeGreaterThan(0)
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
    });
    it('should return comments ordered from most to least recent', async () => {
            const { body } = await request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            expect(body.comments).toBeSortedBy('created_at', {
                descending: true
            })
    });
    it('should return an empty array for an article that has no comments', async () => {
        const { body } = await request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            expect(body.comments.length).toBe(0)
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('should post a comment to the database', async () => {
            const input = {
                "username": "butter_bridge",
                "body": "Testing, testing. 1, 2, 3."
            }
            const { body } = await request(app)
            .post('/api/articles/1/comments')
            .send(input)
            .expect(200)
            expect(body).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String)
            })
    });
    it('should not post when a username does not exist', async () => {
        const input = {
            "username": "liampjh34",
            "body": "This should not work."
        }
        const { body } = await request(app)
        .post('/api/articles/1/comments')
        .send(input)
        .expect(400)
        expect(body.msg).toEqual("No user found")
    });
    it('should not post when an article does not exist', async () => {
        const input = {
            "username": "butter_bridge",
            "body": "Testing, testing. 1, 2, 3."
        }
        const { body } = await request(app)
        .post('/api/articles/3423423/comments')
        .send(input)
        .expect(404)
        expect(body.msg).toEqual("Article not found")
    });
    it('should not post when the article ID is NaN', async () => {
        const input = {
            "username": "butter_bridge",
            "body": "Testing, testing. 1, 2, 3."
        }
        const { body } = await request(app)
        .post('/api/articles/e/comments')
        .send(input)
        .expect(400)
        expect(body.msg).toEqual("Wrong data type")
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('should 200 and delete a comment', async () => {
        const { body } = await request(app)
        .delete('/api/comments/3')
        .expect(204)
    });
    it('should error if associated article does not have comments', async () => {
        const { body } = await request(app)
        .delete('/api/comments/3453453')
        .expect(404)
        expect(body.msg).toBe('comment not found')
    })
    it('should error if parametric id is NaN', async () => {
        const { body } = await request(app)
        .delete('/api/comments/e')
        .expect(400)
        expect(body.msg).toBe('Wrong data type')
    });;
});