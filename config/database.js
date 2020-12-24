//Set up mongoose connection
console.log("in db config");
const mongoose = require("mongoose");
const mongoDB = "mongodb://localhost:27017/node-crud";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
