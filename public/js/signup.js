const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Course
var userDetails = new Schema({
  user_name: {
    type: String
  },
  user_email: {
    type: String
  },
  user_password: {
    type: String
  },
  user_age: {
    type: Number 
  },
  user_address: {
    type: String
  }
},{
    collection: 'signup'
});

module.exports = mongoose.model('signup', userDetails);