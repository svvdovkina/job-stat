const {StatusCodes} = require("http-status-codes");
const CustomAPIError = require("./custom-api")

class UnauthenticatedError extends CustomAPIError {
    constructor(msg) {
        super(msg, StatusCodes.UNAUTHORIZED)
    }
}

module.exports = UnauthenticatedError