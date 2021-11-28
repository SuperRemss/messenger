const express = require('express');
const MessageModel = require("../model/message.model");
const {body, param, validationResult} = require("express-validator");
const DiscussionModel = require("../model/discussion.model");
const router = express.Router();
const auth = require('../middleware/auth')
const isInDiscussion = require('../middleware/isInDiscussion')


/**
 * Send a message
 */
router.post('/', auth, isInDiscussion,
  body("msgContent").escape(),
  async (req, res) => {
  try {
   let discussion = await DiscussionModel.findOne({_id: req.body.idDiscussion});
    // Message creation
    let message = new MessageModel({"message": req.body.msgContent, "sender": req.user._id});
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
 * Find messages with pagination (page & limit)
 */
router.get('/', auth, async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const messages = await MessageModel.find();
  if (!messages) {
    return res.status(404).send({message: 'Messages not found'});
  }
  res.status(200).send({
    messages: messages.slice(startIndex, endIndex),
    page: page,
    limit: limit,
    nbMessages: messages.slice(startIndex, endIndex).length
  });
})

/**
 * Find messages i sent  with pagination (page & limit
 */
router.get('/me', auth, async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const messages = await MessageModel.find({sender: req.user._id});
  if (!messages) {
    return res.status(404).send({message: 'Messages not found'});
  }
  res.status(200).send({
    messages: messages.slice(startIndex, endIndex),
    page: page,
    limit: limit,
    nbMessages: messages.slice(startIndex, endIndex).length
  });
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
    const message = await MessageModel.findOne({_id: req.params.id});
    if (!message) {
      return res.status(404).send({message: 'Message not found'});
    }
    res.status(200).send({message: message});
  })


module.exports = router;