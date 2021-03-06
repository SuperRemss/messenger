const express = require('express');
const UserModel = require("../model/user.model");
const {param, validationResult, body} = require("express-validator");
const auth = require("../middleware/auth");
const router = express.Router();


/**
 * Find users (don't need to be connected)
 */
router.get('/', async (req, res) => {
  const users = await UserModel.find();
  res.send(users);
})

/**
 * Find the current user
 */
router.get('/me', auth, async (req, res) => {
  const user = await UserModel.findOne({_id: req.user._id});
  if (!user) {
    return res.status(404).send({message: 'user not found'});
  }
  res.send({user: user});
})

/**
 * Find by id
 */
router.get('/:id', auth,
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
    const user = await UserModel.findOne({_id: req.params.id});
    if (!user) {
      res.status(404).send({message: 'user not found'});
    }
    res.send({user: user});
  })

/**
 * Create a user
 */
router.post('/', body("name").escape(), async (req, res) => {
  try {
    let user = new UserModel(req.body);
    user = await user.save();
    res.status(201).send({user: user});
  } catch (e) {
    res.status(400).send(e);
  }
})

module.exports = router