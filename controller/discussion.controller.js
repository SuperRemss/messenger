const express = require('express');
const DiscussionModel = require("../model/discussion.model");
const UserModel = require("../model/user.model");
const {param, validationResult, body} = require("express-validator");
const router = express.Router();
const discussionFindMiddleware = async (req, res, next) => {

  req.discussion = discussion;
  next();
};


/**
 * Create a discussion
 */
router.post('/', body("name").escape(), async (req, res) => {
  try {
    let discussion = new DiscussionModel(req.body);
    discussion.members.push(req.user._id);
    discussion = await discussion.save();
    res.status(201).send({discussion: discussion});
  } catch (e) {
    res.status(400).send(e);
  }
})

/**
 * Find discussions i am in
 */
router.get('/iAmIn', async (req, res) => {
  const discussion = await DiscussionModel.find({members: req.user._id});
  res.send(discussion);
})


/**
 * Remove myself from a discussion
 */
router.put('/deleteMyself', async (req, res) => {
  try {
    let discussion = await DiscussionModel.findOne({_id: req.body.idDiscussion, members: req.user._id});
    if (!discussion) {
      return res.status(400).send({message: 'User isn\'t in the discussion'});
    }
    const indexUser = discussion.members.indexOf(req.user._id);
    if (indexUser > -1) {
      discussion.members.splice(indexUser, 1);
    }
    discussion = await discussion.save();

    res.status(201).send({discussion: discussion});
  } catch (e) {
    res.status(404).send(e);
  }
})


/**
 * Add a member to a discussion
 */
router.put('/addMember', async (req, res) => {
  try {
    let idDiscussion = req.body.idDiscussion;
    let discussion = await DiscussionModel.findOne({_id: idDiscussion});
    if (!discussion) {
      return res.status(404).send({message: 'discussion not found'});
    }

    let idMember = req.body.idMember;
    const member = await UserModel.findOne({_id: idMember});
    if (!member) {
      return res.status(404).send({message: 'member not found'});
    }

    const memberInDiscussion = discussion.members.includes(idMember);
    if (memberInDiscussion) {
      return res.status(409).send({message: 'member already in the discussion'});
    }

    discussion.members.push(idMember);
    discussion = await discussion.save();

    res.status(201).send({discussion: discussion});
  } catch (e) {
    res.status(400).send(e);
  }
})

/**
 * Find by id
 */
router.get('/:id',
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isMongoId()
    .withMessage('id needs to be a mongodb id'),
  (req, res, next) => {
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
    res.send({discussion});
  })

module.exports = router;