// express
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const boardRouter = require('./router/board');
const db = require('./lib/db');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

db.createPool();

app.use('/', boardRouter);

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});