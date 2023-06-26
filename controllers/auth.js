const User = require("../models/User");
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, UnauthenticatedError} = require("../errors");

const register = async (req, res) =>{

    const user = await User.create(req.body);
    const token = user.createJWT();
    const userObject = {
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        token: token
    }
    res.status(StatusCodes.CREATED).json({user: userObject})
}

const login = async (req, res) =>{
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new UnauthenticatedError("No user with given email")
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new UnauthenticatedError("Wrong password")
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            token: token
        }
    });
}

const updateUser = async (req, res) => {
    const {email, name, lastName, location} = req.body;
    if (! email || ! name || ! lastName || ! location)  {
        throw new BadRequestError("Please provide all the values")
    }
    const userId = req.user.userId;
    const user = await User.findById(userId);
    //console.log(user._id, req.user )
    
    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();

    const token = user.createJWT();

    user.token = token;
    
    res.status(StatusCodes.OK).json({
        user:{
            name: user.name,
            lastName: user.lastName,
            location: user.location,
            email: user.email,
            token
        }})
}

module.exports = {register, login, updateUser}