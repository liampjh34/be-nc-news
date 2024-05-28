const { fetchArticleById } = require('../models/articles.models')

exports.getArticleById = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const fetchedArticle = await fetchArticleById(article_id)
        
        if (fetchedArticle.length === 0) {
            res.status(400).send({
                msg: 'No results found'
            })
        }
        
        res.status(200).send(fetchedArticle)
    } catch(error) {
        next(error)
    }
}