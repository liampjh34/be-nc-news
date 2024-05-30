const { fetchArticleComments, handleComment } = require("../models/comments.models")

exports.getArticleComments = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const queryResults = await fetchArticleComments(article_id)
        res.status(200).send(queryResults)
    } catch(error) {
        next(error)
    }
}

exports.postComment = async (req, res, next) => {
    try{
        const { article_id } = req.params
        const { username, body } = req.body
        const results = await handleComment(username, article_id, body)
        res.status(200).send(results)
    } catch(error) {
        next(error)
    }
}