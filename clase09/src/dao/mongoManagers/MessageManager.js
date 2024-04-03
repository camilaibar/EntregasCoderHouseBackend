const messageModel = require("../models/messagesModel");

class MessageManager {
  addMessage = async ({ user, message }) => {
    const result = await messageModel.create({
      user: user,
      message: message,
    });
    return result;
  };

  getAllMessages = async (limit = 0) => {
    const result = await messageModel.find().limit(limit);
    return result;
  };

  getMessageById = async (mid) => {
    const result = await messageModel.findOne({ _id: mid });
    return result; // null if message not found
  };

  updateMessageById = async (cart) => {
    const { _id: mid, ...updatedFields } = cart;
    const result = await messageModel.findOneAndUpdate(
      { _id: mid },
      { $set: updatedFields }
    );

    return result; // crash if message not found
  };

  deleteAllMessages = async () => await messageModel.deleteMany();

  deleteMessageById = async (mid) => {
    const result = await messageModel.deleteOne({ _id: mid });
    return result.deleteCount; // 0 if not found
  };
}

module.exports = MessageManager;
