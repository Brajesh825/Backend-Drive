const mongoose = require("mongoose");

const connectDB = () => {
  const conn = mongoose.connect(process.env.MONGO_URI).then((data) => {
    console.log(`Mongodb connected with server : ${data.connection.host}`);
  });

  return conn;
};

module.exports = connectDB;
