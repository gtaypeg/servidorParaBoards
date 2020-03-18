const database = require('../model/index');
const Thread = require('./thread');
const Board = require('./board');
const Reply = require('./reply');

module.exports = {
    Board: new Board(database),
    Thread: new Thread(database),
    Reply: new Reply(database)
};
