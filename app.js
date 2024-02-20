// express
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let posts = [];

app.get('/list', (req, res) => {
    res.render('list', { posts });
});

app.get('/list/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        writer: req.body.writer
    };
    posts.push(newPost);
    res.redirect('/list');
});

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});