const { checkArticleExists } = require('../error-handlers/check-article-exists');
const { checkIsNumber } = require('../error-handlers/check-is-number');
const { checkIsUser } = require('../error-handlers/check-is-user');
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index');
const { checkVotes } = require('../error-handlers/check-votes');
const { checkExists } = require('../error-handlers/check-exists');

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe('checkArticleExists()', () => {
    it(`should return a rejected promise if article doesn't exist`, async () => {
        try {
            const input = 43522
            const result = await checkArticleExists(input)
        } catch(error) {
            expect(error).toMatchObject({
                status: 404,
                msg: 'Article not found'
            })
        }
    });
    it(`should return a resolved promise if article does exist`, async () => {
        try {
            const input = 2
            const result = await checkArticleExists(input)
            expect(result).toBe(true)
        } catch(error) {
            throw error
        }
    });
  });

  describe('checkIsNumber()', () => {
    it('should return true for a number', async() => {
        try{
            const input = 4
            const result = await checkIsNumber(input)
            expect(result).toBe(true)
        } catch(error) {
            throw error
        }
    });
    it('should return a rejected promise for a string', async() => {
        try{
            const input = 'e'
            const result = await checkIsNumber(input)
        } catch(error) {
            expect(error).toMatchObject({
                status: 400,
                msg: 'Wrong data type'
            })
        }
    });
  });

describe('checkIsUser()', () => {
    it('should return true for a user that exists', async () => {
        const input = 'butter_bridge'
        const result = await checkIsUser(input)
        expect(result).toBe(true)
    });
    it('should 404 for user that does not exist', async () => {
        try{
            const input = 'liampjh34'
            const result = await checkIsUser(input)
        } catch(error) {
            expect(error).toMatchObject({
                status: 404,
                msg: "No user found"
            })
        }
    })
});

describe('checkVotes()', () => {
    it('should reject if desired decrement > votes count', async () => {
        try{
            const input = {
                inc_votes: -101
            }
            const articleId = 1
            const result = await checkVotes(input, articleId)
        } catch(error) {
            expect(error).toMatchObject({
                status: 400,
                msg: 'Not allowed!'
            })
        }
    });
    it('should reject if trying to decrement an existing vote count of 0', async () => {
        try{
            const input = {
                inc_votes: -101
            }
            const articleId = 3 // has 0 votes
            const result = await checkVotes(input, articleId)
        } catch(error) {
            expect(error).toMatchObject({
                status: 400,
                msg: 'Not allowed!'
            })
        }
    });
});

describe('checkExists()', () => {
    it('should reject if the thing does not exist', async () => {
        try{
            const input = 234234
            const result = await checkExists('comment', input)
        } catch(error) {
            expect(error).toMatchObject({
                status: 404,
                msg: 'comment not found'
            })
        }
    });
});