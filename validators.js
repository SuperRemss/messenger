const userAlreadyExist = async (value) => {
  const UserModel = require("./model/user.model");
  const users = await UserModel.find({username: value});
  return users.length === 0;
}

const userExist = async (value) => {
  const UserModel = require("./model/user.model");
  return await UserModel.findOne({_id: value});
}

const textTooShort = async (value) => {
  return value.length >= 4;
}

const textTooLong = async (value) => {
  return value.length <= 30;
}

const msgTooLong = async (value) => {
  return value.length <= 300;
}

const verifConnexion =


module.exports = {
  usernameValidators: [
    {validator: userAlreadyExist, msg: "User already exists!"},
    {validator: textTooShort, msg: "Username is too short"},
    {validator: textTooLong, msg: "Username is too long"}],
  passwordValidators: [
    {validator: textTooShort, msg: "Password is too short"},
    {validator: textTooLong, msg: "Password is too long"}],
  discussionValidators: [
    {validator: textTooShort, msg: "Discussion name is too long"},
    {validator: textTooLong, msg: "Discussion name is too long"}],
  messageValidators: [
    {validator: msgTooLong, msg: "Your message is too long"},
  ],
  userNotFound: [{validator: userExist, msg: "User not found"}]
};