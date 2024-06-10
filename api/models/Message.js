const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
