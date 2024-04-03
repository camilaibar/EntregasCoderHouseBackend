const mongoose = require("mongoose");
const mongoosePaginateV2 = require("mongoose-paginate-v2");

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

// Mongoose middlewares
messagesSchema.plugin(mongoosePaginateV2);

const messagesModel = mongoose.model(collectionName, messagesSchema);

module.exports = messagesModel;
