module.exports = class Board {
    constructor(database) {
        this.database = database;
    }
    create(titleBoard) {
        console.log('Board.create()');
        return new Promise((resolve, reject) => {
            try {
                new this.database.Board({ title: titleBoard }).save((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    find(titleBoard) {
        console.log('Board.find()');
        return new Promise((resolve, reject) => {
            try {
                this.database.Board.findOne({ title: titleBoard }).exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    addThread(titleBoard, idThread) {
        console.log('Board.addThread()');
        return new Promise((resolve, reject) => {
            try {
                this.database.Board.findOneAndUpdate({ title: titleBoard }, { $push: { threads: idThread } }, { new: true }).exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    deleteThread(titleBoard, idThread) {
        console.log('Board.deleteThread()');
        return new Promise((resolve, reject) => {
            try {
                this.database.Board.findOneAndUpdate({ title: titleBoard }, { $pull: { threads: idThread } }).exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    get() {
        console.log('Board.get()');
        return new Promise((resolve, reject) => {
            try {
                this.database.Board.find().exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
};
