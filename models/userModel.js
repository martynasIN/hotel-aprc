const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");


const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tell your name"]
    },
    email: {
        type: String,
        required: [true, 'Please provided your email'],
        unique:true,
        lowercase: true,
        validator: [validator.isEmail, 'is not email']
    },
    photo:{
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate:{
            validator: function(el){
                return el === this.password
            },
            message: 'Password are not the same'
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwrodResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    }
});

userShema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userShema.methods.correctPassword = async (
    candidatePassword,
    userPassword
)=>{
    return await bcrypt.compare(candidatePassword, userPassword);
}

userShema.methods.changedPasswordAfter = function (JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000.10)
        return JWTTimestamp < changedTimeStamp
    }
  
}

const User = mongoose.model('User', userShema);

module.exports = User;