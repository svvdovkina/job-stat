const {BadRequestError} = require("../errors")

const restrictTestUser = (req, res, next) => {
    const isTestUser = (req.user.userId === '64997fed41c799247ff8349c');
    if (isTestUser) {
        throw new BadRequestError("Test User - can only read!")
    }
    next();
}

module.exports = restrictTestUser;