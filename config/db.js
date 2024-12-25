const mongoose = require("mongoose");

module.exports.connection = async () => {
  await mongoose.connect("mongodb://127.0.0.1/tekionAdmin");
  console.log("database connected");
};
