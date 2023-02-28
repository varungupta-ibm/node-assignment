let router = require('express').Router();
const controller = require('../controllers/controller');

// Adding a User to Users
router.post('/register', controller.addUser)

// Reading a User from Users
router.get('/getallusers', controller.getAllUsers)

// Reading a User from Users
router.get('/getuser/:id', controller.getUserList)

// Updating the User
router.post('/update/:id', controller.updateUser)

// Deleting the User from Users
router.delete('/delete/:id', controller.deleteUser)

// Export API routes
module.exports = router;