const {register, login, updateUser} = require("../controllers/auth")
const authMiddleware = require("../middleware/auth");
const restrictTestUser = require("../middleware/testUser");

const express = require("express");
const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateUser').patch(authMiddleware, restrictTestUser, updateUser)

module.exports = router