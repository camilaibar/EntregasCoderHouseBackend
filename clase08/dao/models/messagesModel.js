const mongoose = require("mongoose");

const collectionName = "messages";

const messagesSchema = new mongoose.Schema({
  user: {
    type: String, //Email
    required: true,
    //type: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  message: {
    type: String,
    required: true,
  },
});

const messagesModel = mongoose.model(collectionName, messagesSchema);

module.exports = messagesModel;
