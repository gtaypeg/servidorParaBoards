const mongoose = require('mongoose');
module.exports = class Thread {
    constructor(database) {
        this.database = database;
    }
    create(boardId, text, pass) {
        console.log('Thread.create()');
        return new Promise((resolve, reject) => {
            new this.database.Thread({
                _board: boardId,
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
    delete(idThread, idBoard) {
        console.log('Thread.delete()');
        return new Promise((resolve, reject) => {
            this.database.Thread.findOneAndRemove({ _id: idThread, _board: idBoard }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    find(idThread, idBoard) {
        console.log('Thread.find()');

        return new Promise((resolve, reject) => {
            this.database.Thread.findOne({ _id: idThread, _board: idBoard }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    report(idThread, idBoard) {
        console.log('Thread.report()');
        return new Promise((resolve, reject) => {
            this.database.Thread.findOneAndUpdate({ _id: idThread, _board: idBoard }, { reported: true }, { new: true }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    addReply(idThread, idBoard, idReply) {
        console.log('Thread.addReply()');
        return new Promise((resolve, reject) => {
            this.database.Thread.findOneAndUpdate({ _id: idThread, _board: idBoard }, { $push: { replies: idReply } }, { new: true }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    deleteReply(idThread, idBoard, idReply) {
        console.log('Thread.deleteReply()');
        return new Promise((resolve, reject) => {
            this.database.Thread.findOneAndUpdate({ _id: idThread, _board: idBoard }, { $pull: { replies: idReply } }, { new: true }).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    getRecent(idBoard) {
        console.log('Thread.getRecent()');

        return new Promise((resolve, reject) => {
            this.database.Thread.aggregate([{ $match: { _board: mongoose.Types.ObjectId(idBoard) } }, { $unwind: '$replies' }, { $group: { _id: '$_id', count: { $sum: 1 } } }], (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    this.database.Thread.find({ _board: idBoard })
                        .limit(12)
                        .select('created_on replies _id text')
                        .populate({
                            path: 'replies',
                            select: '_id created_on text reported',
                            options: { sort: { created_on: -1 }, limit: 4 }
                        })
                        .lean()
                        .exec((err, thread) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ thread, count });
                            }
                        });
                }
            });
        });
    }
};
