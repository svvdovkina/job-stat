const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 4,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50,
        default: '-'
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
         'You typed not a valid email name'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 4
    },
    location: {
        type: String,
        trim: true,
        maxlength: 50, 
        default: '-'
    }
});

UserSchema.pre('save', async function(){
    //console.log(this.modifiedPaths());
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    const token = jwt.sign(
        {
            userId: this._id,
            name: this.name
        }, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_LIFETIME});
    return token
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
} 

module.exports = mongoose.model('User', UserSchema);