module.exports = ({ repository, services }) => (board, text, pass) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('createThread');
            repository.Board.find(board).then(async boardResult => {
                if (!boardResult) {
                    boardResult = await repository.Board.create(board).catch(err => {
                        reject(err);
                    });
                }
                try {
                    let hashPass = await services.bcrypt.hashPass(pass);

                    let threadResult = await repository.Thread.create(boardResult.id, text, hashPass);
                    await repository.Board.addThread(board, threadResult);

                    resolve(threadResult);
                } catch (err) {
                    reject(err);
                }
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
