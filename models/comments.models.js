const db = require('../db/connection');
const { checkArticleExists } = require('../error-handlers/check-article-exists')
const { checkIsNumber } = require('../error-handlers/check-is-number')

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