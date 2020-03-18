module.exports = ({ repository }) => title => {
    return new Promise((resolve, reject) => {
        try {
            repository.Board.find(title).then(async fBoard => {
                if (fBoard) {
                    resolve({ message: '-1' });
                } else {
                    try {
                        let boardResult = await repository.Board.create(title);
                        resolve(boardResult);
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};
