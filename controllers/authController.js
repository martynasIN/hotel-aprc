const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const {promisify} = require('util');

const signToken = (id) =>{
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

exports.signup = async (req, res) =>{
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })

        const token = jwt.sign( //create user token
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )

        res.status(201).json({
            status: "success",
            data: newUser,
            token
        })
}catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })
    }
}

exports.login = async (req, res)=>{
    try{
        const {email, password} = req.body;

    // check email and password
    if(!email || !password){
        throw new Error("Please provide email and password")
        }
    //check if user exist and password corect
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        throw new Error("Incorect email or password")
    }

    //generate token
    const token = signToken(user._id);

    res.status(201).json({
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    })
    }catch(err){
        res.status(400).json({
            status: "Failed",
            message: err.message
        })

    }
    
}

exports.protect = async (req, res, next) =>{
    let token;
    try{
    // 1. Get token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        throw new Error("User not authentificated")
    }
    // 2. Token verification
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

   

    // 3. Check if user exist in DB

    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        throw new Error("User not found")
    }

    // 4. Check if user changed password after token was generated

    if(currentUser.changedPasswordAfter(decoded.iat)){
        throw new Error("User changed password. Please login again")
    }
    // 5. Grant access
    req.user = currentUser;
   
    next()
    }catch(err){
        res.status(400).json({
            status: "Failed",
            error: err.message
        })
    }

}
