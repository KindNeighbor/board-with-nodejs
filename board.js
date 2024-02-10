const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.post('/addpost', (req, res) => {
    const newPost = req.body.post;
    console.log(newPost);
    posts.push(newPost);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});