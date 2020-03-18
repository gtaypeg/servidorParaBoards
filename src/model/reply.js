const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    _board: {
        type: Schema.Types.ObjectId,
        ref: 'Board'
    },
    _thread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    text: {
        type: String,
        require: true
    },
    created_on: {
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
    }
});

module.exports = mongoose.model('Reply', ReplySchema);
