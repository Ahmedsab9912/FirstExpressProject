const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// Connection to MongoDB
async function connectDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectDB,
};
