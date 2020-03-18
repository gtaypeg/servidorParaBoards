module.exports = class Reply {
    constructor(database) {
        this.database = database;
    }
    create(idBoard, idThread, text, pass) {
        console.log('Reply.create()');
        return new Promise((resolve, reject) => {
            new this.database.Reply({
                _board: idBoard,
                _thread: idThread,
                text: text,
                delete_password: pass
            }).save((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    report(idBoard, idThread, idReply) {
        console.log('Reply.report()');
        return new Promise((resolve, reject) => {
            this.database.Reply.findOneAndUpdate({ _id: idReply, _board: idBoard, _thread: idThread }, { reported: true }, { new: true }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    find(idBoard, idThread, idReply) {
        console.log('Reply.find()');
        return new Promise((resolve, reject) => {
            this.database.Reply.findOne({ _id: idReply, _board: idBoard, _thread: idThread }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    delete(idBoard, idThread, idReply) {
        console.log('Reply.delete()');
        return new Promise((resolve, reject) => {
            this.database.Reply.deleteOne({ _id: idReply, _board: idBoard, _thread: idThread }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    pseudoDelete(idBoard, idThread, idReply) {
        console.log('Reply.pseudoDelete()');
        return new Promise((resolve, reject) => {
            this.database.Reply.findOneAndUpdate({ _id: idReply, _board: idBoard, _thread: idThread }, { $set: { text: '[delete]' } }, { new: true }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    deleteAll(idBoard, idThread) {
        console.log('Reply.deleteAll()');
        return new Promise((resolve, reject) => {
            this.database.Reply.deleteMany({ _board: idBoard, _thread: idThread }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    getAll(idBoard, idThread) {
        console.log('Reply.getAll()');
        return new Promise((resolve, reject) => {
            this.database.Reply.find({ _thread: idThread, _board: idBoard })
                .select('_id _board _thread text created_on')
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
        });
    }
};
