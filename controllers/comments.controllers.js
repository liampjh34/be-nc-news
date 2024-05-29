const { fetchArticleComments } = require("../models/comments.models")

exports.getArticleComments = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const queryResults = await fetchArticleComments(article_id)
        res.status(200).send(queryResults)
    } catch(error) {
        next(error)
    }
}