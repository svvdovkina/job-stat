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

    const userObject = {
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        token: token
    }

    res.status(StatusCodes.OK).json({user: userObject});
}

module.exports = {register, login}