const { connect } = require("mongoose");

const CONNECTION_STRING =
  "mongodb+srv://admin:admin1234@ecommerce.nhojbdn.mongodb.net/ecommerce?retryWrites=true&w=majority";

const dbConfig = {
  connectDB: async () => {
    try {
      await connect(CONNECTION_STRING);
      console.log("BD connected");
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = dbConfig;
