module.exports = ({ repository, services }) => (board, idThread, idReply, pass) => {
    return new Promise((resolve, reject) => {
        repository.Board.find(board)
            .then(boardResult => {
                if (!boardResult) {
                    resolve({ message: 'Board not found' });
                } else {
                    repository.Thread.find(idThread, boardResult.id)
                        .then(async threadResult => {
                            if (!threadResult) {
                                resolve({ message: 'Thread not found' });
                            } else {
                                try {
                                    let replyResult = await repository.Reply.find(boardResult.id, threadResult.id, idReply);
                                    if (replyResult.text != '[deleted]') {
                                        let bcryptResult = await services.bcrypt.checkPass(pass, replyResult.delete_password).catch(err => {
                                            console.log(err);
                                        });

                                        if (bcryptResult) {
                                            try {
                                                await repository.Reply.pseudoDelete(boardResult.id, threadResult.id, replyResult.id);
                                                resolve({ status: '1', id: replyResult._id });
                                            } catch (err) {
                                                reject(err);
                                            }
                                        } else {
                                            resolve({ message: 'Wrong password' });
                                        }
                                    } else {
                                        resolve({ message: 'Reply is already deleted' });
                                    }
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
