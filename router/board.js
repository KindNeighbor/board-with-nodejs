var express = require('express');
var router = express.Router();
var db = require('../lib/db');

// post
router.use(express.urlencoded({
    extended : true
}));

// 게시글 목록 조회
router.get('/list', async (req, res) => {
    try {
        const connection = await db.getConnection();
        if (!connection) {
            // 오류 처리
            res.status(500).send('Internal Server Error');
            return;
        }

        const query = "SELECT * FROM BOARD";
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

// 게시글 생성 페이지
router.get('/list/create', (req, res) => {
    res.render('create')
})

// 게시글 생성
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

// 게시글 상세 조회
router.get('/list/:id', async (req, res) => {
    try {
        const connection = await db.getConnection();
        if (!connection) {
            // 오류 처리
            res.status(500).send('Internal Server Error');
            return;
        }

        const postId = req.params.id;

        // 게시글 조회 쿼리
        const query = "SELECT * FROM BOARD WHERE id = :postId";
        const result = await connection.execute(query, { postId });

        // 결과 처리
        if (result.rows.length === 0) {
            // 해당 ID에 해당하는 게시글이 없는 경우
            res.status(404).send('Not Found');
            return;
        }

        const post = {
            id: result.rows[0][0],
            title: result.rows[0][1],
            content: result.rows[0][2],
            writer: result.rows[0][3],
            created_date: result.rows[0][4],
            modified_date: result.rows[0][5]
        };

        res.render('detail', { post });

        // 연결 반환
        await connection.close();
    } catch (err) {
        console.error('Error while fetching post details:', err);
        res.status(500).send('Internal Server Error');
    }
});

// 게시물 삭제
router.delete('/list/:id/delete', async (req, res) => {
    try {
        const connection = await db.getConnection();
        if (!connection) {
            // 오류 처리
            res.status(500).send('Internal Server Error');
            return;
        }

        const postId = req.params.id;

        // 게시글 삭제 쿼리
        const query = "DELETE FROM BOARD WHERE id = :postId";
        const result = await connection.execute(query, { postId });

        res.json({ success: true, message: '게시글이 성공적으로 삭제되었습니다.' });

        // 연결 반환
        await connection.commit();
        await connection.close();
    } catch (err) {
        console.error('Error while deleting post:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router