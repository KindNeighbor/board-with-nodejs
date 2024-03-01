var express = require('express');
var router = express.Router();
var db = require('../lib/db');

// post
router.use(express.urlencoded({
    extened: true
}));

router.get('/list', async (req, res) => {
    try {
        const connection = await db.getConnection();
        if (!connection) {
            // 오류 처리
            res.status(500).send('Internal Server Error');
            return;
        }

        const query = "SELECT * FROM BOARD"; // 여기에 실제 테이블 이름을 넣어주세요
        const result = await connection.execute(query);

        // 결과 처리
        const posts = result.rows.map(row => ({
            id: row[0],
            title: row[1],
            content: row[2],
            writer: row[3],
            created_date: row[4],
            modified_date: row[5]
        }));
        res.render('list', { posts });

        // 연결 반환
        await connection.close();
    } catch (err) {
        console.error('Error while fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/list/create', (req, res) => {
    res.render('create')
})

router.post('/create', async (req, res) => {
    try {
        const connection = await db.getConnection();
        if (!connection) {
            // 오류 처리
            res.status(500).send('Internal Server Error');
            return;
        }

        const newPost = {
            title: req.body.title,
            content: req.body.content,
            writer: req.body.writer
        };

        let currentTime = new Date();
        const formattedCurrentTime = currentTime.toISOString().slice(0, 19).replace("T", " ");

        const insertQuery = "INSERT INTO BOARD (title, content, writer, created_date) VALUES (:title, :content, :writer, TO_TIMESTAMP(:currentTime, 'YYYY-MM-DD HH24:MI:SS'))";
        const bindParams = {
            title: newPost.title,
            content: newPost.content,
            writer: newPost.writer,
            currentTime: formattedCurrentTime
        };

        await connection.execute(insertQuery, bindParams, { autoCommit: true });

        // 연결 반환
        await connection.close();

        res.redirect('/list');
    } catch (err) {
        console.error('Error while creating post:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router