const express = require('express');
const DiscussionModel = require("../model/discussion.model");
const {param, validationResult, body} = require("express-validator");
const UserModel = require("../model/user.model");
const router = express.Router();



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
 * Find discussions
 */
router.get('/', async (req, res) => {
  const discussions = await DiscussionModel.find();
  res.send({discussions: discussions});
})

/**
 * Find discussions i am in
 */
router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).send({message: 'unauthorized'});
  }
  const discussions = await DiscussionModel.find({members: req.user._id});
  if (!discussions) {
    return res.status(404).send({message: 'discussions not found'});
  }
  res.send({discussions: discussions});
})

/**
 * Find by id
 */
router.get('/:id?',
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
    res.send({discussion:discussion});
})


/**
 * Add a member to a discussion
 */
router.put('/:id/addMember',
  param('id')
  .notEmpty()
  .withMessage('id is required')
  .isMongoId()
  .withMessage('id needs to be a mongodb id'),
  async (req, res) => {
  try {
    let discussion = await DiscussionModel.findOne({_id: req.params.id});
    if (!discussion) {
      return res.status(404).send({message: 'discussion not found'});
    }
    const currentUserInDiscussion = discussion.members.includes(req.user._id);
    if (!currentUserInDiscussion) {
      return res.status(404).send({message: 'You aren\'t a member of this discussion so you can\'t add a member' });
    }
    const memberInDiscussion = discussion.members.includes(req.body.idMember);
    if (memberInDiscussion) {
      return res.status(409).send({message: 'member already in the discussion'});
    }

    discussion.members.push(req.body.idMember);
    discussion = await discussion.save();

    res.status(201).send({discussion: discussion});
  } catch (e) {
    res.status(400).send(e);
  }
})

/**
 * Remove myself from a discussion
 */
router.put('/:idDiscussion/me',
  param('idDiscussion')
  .notEmpty()
  .withMessage('idDiscussion is required')
  .isMongoId()
  .withMessage('idDiscussion needs to be a mongodb id'),
  async (req, res) => {
  try {
    let discussion = await DiscussionModel.findOne({_id: req.params.idDiscussion, members: req.user._id});
    if (!discussion) {
      return res.status(400).send({message: 'You aren\'t in the discussion'});
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
 * Remove a member of a discussion
 */
router.put('/:idDiscussion/deleteMember',
  param('idDiscussion')
    .notEmpty()
    .withMessage('idDiscussion is required')
    .isMongoId()
    .withMessage('idDiscussion needs to be a mongodb id'),
  async (req, res) => {
    try {
      let discussion = await DiscussionModel.findOne({_id: req.params.idDiscussion, members: req.user._id});
      if (!discussion) {
        return res.status(400).send({message: 'You aren\'t in the discussion so you can\'t delete a member'});
      }
      if(!discussion.members.includes(req.body.idMember)){
        return res.status(400).send({message: 'The member isn\'t in the discussion'});
      }
      const indexUser = discussion.members.indexOf(req.body.idMember);
      if (indexUser > -1) {
        discussion.members.splice(indexUser, 1);
      }
      discussion = await discussion.save();

      res.status(201).send({discussion: discussion});
    } catch (e) {
      res.status(404).send(e);
    }
  })



module.exports = router;