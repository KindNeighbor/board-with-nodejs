// express
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.post('/addpost', (req, res) => {
    const newPost = req.body.post;
    posts.push(newPost);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});