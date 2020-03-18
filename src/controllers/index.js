const services = require('../services/index');
const repository = require('../respository/index');

module.exports = {
    createReply: require('./createReply')({ repository, services }),
    createThread: require('./createThread')({ repository, services }),

    deleteReply: require('./deleteReply')({ repository, services }),
    deleteThread: require('./deleteThread')({ repository, services }),

    getRecentThreads: require('./getRecentThreads')({ repository }),
    getReplies: require('./getReplies')({ repository }),

    reportReply: require('./reportReply')({ repository, services }),
    reportThread: require('./reportThread')({ repository }),

    getBoards: require('./getBoards')({ repository }),
    createBoard: require('./createBoard')({ repository })
};
