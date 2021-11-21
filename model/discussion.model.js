const mongoose = require('./mongoose');

const discussionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "You must set a name"],
      validate: {
        validator: async (value) => {
          return value.length !== "";
        },
        message: 'You must set a name!'
      }
    },
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  },
  {timestamps: true});

const DiscussionModel = mongoose.model('discussion', discussionSchema);
module.exports = DiscussionModel;