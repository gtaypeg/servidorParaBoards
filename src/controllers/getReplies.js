module.exports = ({ repository }) => (board, idThread) => {
    return new Promise((resolve, reject) => {
        repository.Board.find(board).then(boardResult => {
            if (!boardResult) {
                resolve({ message: 'Board not found' });
            } else {
                repository.Thread.find(idThread, boardResult._id)
                    .then(threadResult => {
                        if (!threadResult) {
                            resolve({ message: 'Thread not found' });
                        } else {
                            repository.Reply.getAll(boardResult._id, idThread)
                                .then(replyResult => {
                                    resolve({
                                        thread: {
                                            _id: threadResult._id,
                                            created_on: threadResult.created_on,
                                            text: threadResult.text
                                        },
                                        replies: replyResult
                                    });
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    });
};
