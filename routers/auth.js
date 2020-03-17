const express = require('express');
const { protect } = require('../middleware/auth');

const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgetPassword,
  resetPassword
} = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgetpassword', forgetPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
