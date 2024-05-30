const db = require('../db/connection');
const { checkArticleExists } = require('../error-handlers/check-article-exists')
const { checkIsNumber } = require('../error-handlers/check-is-number')
const { checkIsUser } = require('../error-handlers/check-is-user');

exports.fetchArticleComments = async (articleId) => {
    try {
        const promises = [
            checkArticleExists(articleId),
            checkIsNumber(articleId)
        ]

        const results = await Promise.all(promises)

        const queryString = `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`
        const queryParams = [articleId]
        const queryResults = await db.query(queryString, queryParams)
        return queryResults.rows
    } catch(error) {
        throw error
    }
}

exports.handleComment = async (username, article_id, body) => {
    try {
        const promises = [
            checkIsUser(username),
            checkArticleExists(article_id),
            checkIsNumber(article_id)
        ]

        const promiseResults = await Promise.all(promises)

        const queryString = `INSERT INTO comments
        (body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`
        const queryParams = [body, article_id, username]
    
        const { rows } = await db.query(queryString, queryParams)
    
        return rows[0]
    } catch(error) {
        throw error
    }
}