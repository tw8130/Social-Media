const express = require('express');
const router = express.Router();
const authorize = require("../middlewares/auth");
const userController = require('../controllers/userController');
// const sendMail = require('../utilis/userMail');


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.get('/', userController.getAllUsers);
//router.use(authorize)
router.get('/landing', authorize, userController.landingPage);

// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);
// router.post('/sendMail', (req, res) => {
//     sendMail()
//     res.send('I tried to send a mails.Go to the console and confirm')
// })

module.exports = router;