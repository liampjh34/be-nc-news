const { fetchArticles, fetchArticleById, updateArticle } = require('../models/articles.models')

exports.getArticles = async (req, res, next) => {
    try {
        const { topic } = req.query
        const fetchedArticles = await fetchArticles(topic)
        res.status(200).send(fetchedArticles)
    } catch(error) {
        next(error)
    }
}

exports.getArticleById = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const fetchedArticle = await fetchArticleById(article_id)
        
        res.status(200).send(fetchedArticle)
    } catch(error) {
        next(error)
    }
}

exports.patchArticle = async (req, res, next) => {
    try{
        const { article_id } = req.params
        const { body } = req
        const response = await updateArticle(article_id, body)
        res.status(200).send(response)
    } catch(error) {
        next(error)
    }
}