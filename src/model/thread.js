const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    _board: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    text: {
        type: String,
        require: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    bumped_on: {
        type: Date,
        default: Date.now
    },
    reported: {
        type: Boolean,
        default: false
    },
    delete_password: {
        type: String,
        require: true
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ]
});

module.exports = mongoose.model('Thread', ThreadSchema);
