const express = require('express');
const { userRegister, userLogin, getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/get", authMiddleware, getProfile)

module.exports = router;