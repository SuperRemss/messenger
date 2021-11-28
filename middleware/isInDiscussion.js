const DiscussionModel = require("../model/discussion.model");

// Check if the connected user is in the discussion
module.exports = async function(req, res) {
  const discussion = await DiscussionModel.findOne({_id: req.params.id});
  if (!discussion) {
    return res.status(404).send({message: 'discussion not found'});
  }
  //Check if logged user is in the discussion exist
  const currentUserInDiscussion = discussion.members.includes(req.user._id);
  if (!currentUserInDiscussion) {
    return res.status(404).send({message: 'You aren\'t a member of this discussion'});
  }
};

