const mongoose = require("mongoose");

const collectionName = "messages";

const messagesSchema = new mongoose.Schema({
  user: {
    type: String, //Email
    require: true,
    //type: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  message: {
    type: String,
    require: true,
  },
});

const messagesModel = mongoose.model(collectionName, messagesSchema);

module.exports = messagesModel;
