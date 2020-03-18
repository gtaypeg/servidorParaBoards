module.exports = ({ repository, services }) => (board, id, pass) => {
    return new Promise((resolve, reject) => {
        try {
            repository.Board.find(board).then(boardResult => {
                if (!boardResult) {
                    resolve({ message: 'Board not found' });
                } else if (boardResult) {
                    repository.Thread.find(id, boardResult._id)
                        .then(async threadResult => {
                            if (!threadResult) {
                                resolve({ message: 'Thread not found' });
                            } else if (threadResult) {
                                if (await services.bcrypt.checkPass(pass, threadResult.delete_password)) {
                                    try {
                                        await repository.Board.deleteThread(board, threadResult.id);
                                        await repository.Thread.delete(threadResult.id, boardResult.id);
                                        await repository.Reply.deleteAll(boardResult.id, threadResult.id);

                                        resolve({ message: 'delete' });
                                    } catch (err) {
                                        reject(err);
                                    }
                                } else {
                                    resolve({ message: 'Wrong Password' });
                                }
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        });
                }
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
