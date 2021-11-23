const mongoose = require('./mongoose');
const validators = require("../validators");


const discussionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      validate: validators.discussionValidators
    },
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  },
  {timestamps: true});

const DiscussionModel = mongoose.model('discussion', discussionSchema);
module.exports = DiscussionModel;