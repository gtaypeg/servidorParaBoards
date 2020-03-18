const Thread = require('../model/model');

module.exports = {
    createThread: require('./createThread')(Thread)
};
