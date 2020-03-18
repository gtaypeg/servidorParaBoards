module.exports = ({ repository }) => boardTitle => {
    return new Promise((resolve, reject) => {
        try {
            repository.Board.find(boardTitle)
                .then(boardResult => {
                    if (!boardResult) {
                        resolve({ status: '-1' });
                    } else {
                        repository.Thread.getRecent(boardResult.id)
                            .then(threadResult => {
                                let j = threadResult.count.length - 1;
                                let i = 0;

                                while (j >= 0 && i < threadResult.thread.length) {
                                    if (threadResult.thread[i]._id.toString() === threadResult.count[j]._id.toString()) {
                                        let pair = {
                                            replyCount: threadResult.count[j].count,
                                            replyHidden: threadResult.count[j].count - threadResult.thread[i].replies.length
                                        };

                                        threadResult.thread[i] = { ...threadResult.thread[i], ...pair };
                                        console.log(threadResult.thread[i]);
                                        j--;
                                        i = -1;
                                    }
                                    i++;
                                }
                                threadResult.thread.forEach((element, i) => {
                                    threadResult.thread[i].replies.reverse();
                                });
                                resolve({ status: 1, threads: threadResult.thread.reverse() });
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    });
};
