module.exports = database => (idBoard, idThread, text, pass) => {
    return new Promise((resolve, reject) => {
        new database.Reply({
            _board: idBoard,
            _thread: idThread,
            text,
            delete_password: pass
        })
            .save()
            .exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
    });
};
