module.exports = ({ repository, services }) => (board, threadId, text, pass) => {
    return new Promise((resolve, reject) => {
        try {
            repository.Board.find(board).then(boardResult => {
                if (!boardResult) {
                    resolve({ message: 'Board not found' });
                } else {
                    console.log(boardResult);
                    repository.Thread.find(threadId, boardResult._id)
                        .then(async threadResult => {
                            if (!threadResult) {
                                resolve({ message: 'Thread not found' });
                            } else {
                                try {
                                    let hashPass = await services.bcrypt.hashPass(pass);
                                    let replyResult = await repository.Reply.create(boardResult.id, threadResult.id, text, hashPass);
                                    await repository.Thread.addReply(threadResult.id, boardResult.id, replyResult.id);
                                    resolve({
                                        created_on: replyResult.created_on,
                                        _id: replyResult._id,
                                        text: replyResult.text
                                    });
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};
