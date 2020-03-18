const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');

router.route('/').get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});
// router.route('/boards').get((req, res) => {
//     res.render('boards');
// });
router.route('/threads').get((req, res) => {
    res.json({ message: 'PROXIMAMENTE...' });
});

router
    .route('/api/boards')
    .post(async (req, res) => {
        console.log('POST api/boards');
        try {
            let title = req.body.title.trim();
            if (title) {
                let boardResult = await controllers.createBoard(title);

                res.json(boardResult);
            }
        } catch (err) {
            res.status(500);
        }
    })
    .get(async (req, res) => {
        console.log('GET api/boards');
        try {
            let title = (req.query.title || '').trim();
            let response = await controllers.getBoards(title);
            console.log(response);
            res.json(response);
        } catch (err) {
            res.status(500);
        }
    });

router
    .route('/api/threads/:board')
    .post((req, res) => {
        console.log('POST /api/threads/:board');
        console.log(req.body);
        console.log(req.params);
        try {
            let { text, pass } = req.body;
            let board = req.params.board;
            text = text.trim();

            if (!board || !text || !pass) {
                console.log('invalid input');
                res.json({ message: 'invalid input' });
            } else {
                controllers.createThread(board, text, pass).then(result => {
                    console.log('\n\n\n\napis.js\n');
                    let response = result._id;
                    console.log(response);
                    res.json({ id: response });
                });
            }
        } catch (err) {
            res.status(500);
        }
    })
    .put((req, res) => {
        console.log('PUT /api/threads/:board');
        try {
            let board = req.params.board;
            let { id } = req.body;
            console.log(id, board);
            controllers.reportThread(board, id).then(data => {
                console.log('controllers.reportThread(board, id)');
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    })
    .delete((req, res) => {
        console.log('DELETE /api/threads/:board');
        try {
            console.log(req.body);
            let { id, pass } = req.body;
            let board = req.params.board;
            controllers.deleteThread(board, id, pass).then(data => {
                console.log('controllers.deleteThread');
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    })
    .get((req, res) => {
        console.log('GET /api/threads/:board');
        try {
            let { board } = req.params;
            controllers.getRecentThreads(board).then(data => {
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    });

router
    .route('/api/replies/:board')
    .post((req, res) => {
        try {
            console.log('POST /api/replies/:board');
            console.log(req.body);
            let board = req.params.board;
            let { id, text, pass } = req.body;
            controllers.createReply(board, id, text, pass).then(data => {
                console.log('controllers.createReply');
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    })
    .put((req, res) => {
        try {
            console.log('PUT /api/replies/:board');
            let board = req.params.board;
            let { idThread, idReply } = req.body;
            console.log(req.params);
            controllers.reportReply(board, idThread, idReply).then(data => {
                console.log('controllers.reportReply');
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    })
    .delete((req, res) => {
        try {
            console.log('DELETE /api/replies/:board');
            let board = req.params.board;
            let { idThread, idReply, pass } = req.body;
            controllers.deleteReply(board, idThread, idReply, pass).then(data => {
                console.log(data);
                res.json(data);
            });
        } catch (err) {
            res.status(500);
        }
    })
    .get((req, res) => {
        console.log('GET /api/replies/:board');
        try {
            let thread_id = req.query.thread_id.trim();
            let board = req.params.board;
            controllers.getReplies(board, thread_id).then(result => {
                console.log(result);
                res.json(result);
            });
        } catch (err) {
            res.status(500);
        }
    });

module.exports = router;
