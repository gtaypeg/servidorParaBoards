module.exports = ({ repository }) => (board, id) => {
    console.log(board);
    return new Promise((resolve, reject) => {
        repository.Board.find(board)
            .then(async boardResult => {
                if (!boardResult) {
                    resolve({ message: 'Board not found' });
                } else {
                    try {
                        let threadResult = await repository.Thread.report(id, boardResult._id);
                        if (threadResult) {
                            resolve({ message: '1' });
                        } else {
                            console.log('Thread not found');
                        }
                    } catch (err) {
                        reject(err);
                    }
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};
