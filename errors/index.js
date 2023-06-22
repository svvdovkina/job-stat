const CustomAPIError = require("./custom-api")
const BadRequestError = require("./bad-request")
const NotFoundError = require("./not-found")
const UnauthenticatedError = require("./unathenticated")

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
}
