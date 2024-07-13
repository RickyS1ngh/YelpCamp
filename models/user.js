const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
userSchema.plugin(passportLocalMongoose); //adds onto the schema a field for username as well as password. Makes sure usernames are unique

module.exports = mongoose.model("User", userSchema);
