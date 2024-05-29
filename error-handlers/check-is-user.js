const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(testData)
})

exports.checkIsUser = async (username) => {
    const queryString = `SELECT * FROM users
    WHERE username = $1;`
    const queryParams = [username]

    const { rows } = await db.query(queryString, queryParams)

    if (rows.length === 0) {
        return Promise.reject({
            status: 400,
            msg: "No user found"
        })
    }

    return Promise.resolve(true)
}