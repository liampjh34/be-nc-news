const { fetchAllTopics } = require('../models/topics.models')
const app = require('../app')

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchAllTopics()
        res.status(200).send(topics)
    } catch(error) {
        next(error)
    }
    
}