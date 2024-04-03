const { connect } = require("mongoose");

// TODO: Why is DB_CNN needed?
const DB_CNN = undefined;
const CONNECTION_STRING =
  "mongodb+srv://admin:admin1234@ecommerce.nhojbdn.mongodb.net/ecommerce?retryWrites=true&w=majority";

const connectionConfig = {
  url: DB_CNN ?? CONNECTION_STRING,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDBConnection = async () => {
  try {
    await connect(connectionConfig.url, connectionConfig.options);
    console.log("BD connected");
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = { connectionConfig, mongoDBConnection };
