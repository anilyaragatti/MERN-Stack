const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose').default;
const plm = require('passport-local-mongoose');
const passportLocalMongoose = plm.default || plm;


 const userSchema = new Schema({
    email: {
        type: String,
        required: true,   
    }

 });

userSchema.plugin(passportLocalMongoose); //adds username and password fields to user schema and also adds some methods to user model
 
module.exports = mongoose.model('User', userSchema);
