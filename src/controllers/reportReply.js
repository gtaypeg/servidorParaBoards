module.exports = ({ repository }) => (board, idThread, idReply) => {
    return new Promise((resolve, reject) => {
        repository.Board.find(board)
            .then(boardResult => {
                if (!boardResult) {
                    resolve({ message: 'Board not found' });
                } else {
                    repository.Thread.find(idThread, boardResult._id)
                        .then(async threadResult => {
                            if (!threadResult) {
                                resolve({ message: 'Thread not found' });
                            } else {
                                try {
                                    let replyResult = await repository.Reply.report(boardResult.id, threadResult.id, idReply);
                                    resolve({ message: '1' });
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};
