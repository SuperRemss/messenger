const mongoose = require('./mongoose');
const UserModel = require("../model/user.model");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    validate: {
      validator: async (value) => {
        return value.length !== "";
      },
      message: 'You must enter some text'
    }
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (idUser) =>{
        const user = await UserModel.findOne({_id: idUser});
        if(!user) {
          return false;
        }
        return true
  },
    message: 'User not find'}}
});

const MessageModel = mongoose.model('message', messageSchema);
module.exports = MessageModel;