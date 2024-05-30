const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticles, getArticleById } = require('./controllers/articles.controllers');
const { getArticleComments, postComment } = require('./controllers/comments.controllers');

const app = express()

app.use(express.json())

//GET
app.get('/api', getApi)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.get('/api/topics', getTopics)

//POST
app.post('/api/articles/:article_id/comments', postComment)

//psql error handler
app.use((error, req, res, next) => {
    if (error.code === '22P02') {
        res.status(400).send({
            msg: 'Wrong data type'
        })
    } 
    next(error)
})

//custom error handler
app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status).send({
            msg: error.msg
        })
    }
    next(error)
});

module.exports = app