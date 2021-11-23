const mongoose = require('./mongoose');
const validators = require("../validators");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    validate: validators.messageValidators
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate:validators.userNotFound
  }
});

const MessageModel = mongoose.model('message', messageSchema);
module.exports = MessageModel;