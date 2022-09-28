const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/updateUser').patch(authController.updateUser);

module.exports = router;
