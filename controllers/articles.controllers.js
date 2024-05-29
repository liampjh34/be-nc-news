const { fetchArticles, fetchArticleById } = require('../models/articles.models')

exports.getArticles = async (req, res, next) => {
    try {
        const fetchedArticles = await fetchArticles()
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