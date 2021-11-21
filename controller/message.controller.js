const express = require('express');
const MessageModel = require("../model/message.model");
const router = express.Router();


/**
 * Send a message
 */
router.post('/', async (req, res) => {
  try {
    let message = new MessageModel(req.body);
    message = await message.save();
    res.status(201).send({message: message});
  } catch (e) {
    res.status(400).send(e);
  }
})


module.exports = router;