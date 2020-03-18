module.exports = ({ repository }) => title => {
    return new Promise((resolve, reject) => {
        try {
            repository.Board.get(title ? { title } : {}).then(data => {
                resolve(data.reverse());
            });
        } catch (err) {
            reject(err);
        }
    });
};
