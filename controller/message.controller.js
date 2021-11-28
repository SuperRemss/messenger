const express = require('express');
const MessageModel = require("../model/message.model");
const {body, param, validationResult} = require("express-validator");
const DiscussionModel = require("../model/discussion.model");
const router = express.Router();
const auth = require('../middlewareAuth')


/**
 * Send a message
 */
router.post('/', auth, body("msgContent").escape(), async (req, res) => {
  try {
    // Check if the discussion exist
    let discussion = await DiscussionModel.findOne({_id: req.body.idDiscussion});
    if (!discussion) {
      return res.status(404).send({message: 'discussion not found'});
    }
    // Check if the current user is in the discussion
    const currentUserInDiscussion = discussion.members.includes(req.user._id);
    if (!currentUserInDiscussion) {
      return res.status(404).send({message: 'You aren\'t a member of this discussion so you can\'t send a message' });
    }
    // Message creation
    let message = new MessageModel({"message":req.body.msgContent, "sender":req.user._id});
    message = await message.save();
    // Add message to the discussion
    discussion.messages.push(message._id);
    discussion = await discussion.save();

    res.status(200).send({discussion: discussion});
  } catch (e) {
    res.status(400).send(e);
  }
})

/**
 * Find messages
 */
router.get('/', auth, async (req, res) => {
    const messages = await MessageModel.find();
    res.status(200).send({messages: messages});
})


/**
* Find by id
*/
router.get('/:id?', auth,
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id needs to be a mongodb id'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next()
  },
  async (req, res) => {
    const discussion = await DiscussionModel.findOne({_id: req.params.id});
    if (!discussion) {
      return res.status(404).send({message: 'discussion not found'});
    }
    res.status(200).send({discussion:discussion});
  })




module.exports = router;