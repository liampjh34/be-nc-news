const { checkArticleExists } = require('../error-handlers/check-article-exists');
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

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