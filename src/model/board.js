const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    threads: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
});

module.exports = mongoose.model('Board', BoardSchema);
