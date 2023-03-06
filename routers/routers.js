let router = require('express').Router();
const { check } = require("express-validator");

const { token } = require('../controllers/commonController');
const usrCtrl = require('../controllers/userController');
const authCtrl = require('../controllers/authController');

/**
 * 
 * USER ROUTERS
 */

// Adding a Employer/ Employee to Users
router.post('/register', token, usrCtrl.addUser)

// Reading All Employer/ Employee based on Employer Id from Users
router.post('/get-all-users', token, usrCtrl.getAllUsers)

// Verify Employee
router.put('/verify-employee/:id', token, usrCtrl.verifyEmployee)

// Updating the Employer/ Employee
router.put('/update-user/:id', token, usrCtrl.updateUser)

// Deleting the Employer/ Employee from Users
router.delete('/delete-user/:id', token, usrCtrl.deleteUser)

/**
 * AUTH ROUTERS
 */

// Register as an Employer
router.post('/sign-up',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password, password should be of minimum 6 characters.').isLength({min: 6})
    ], authCtrl.signUp);

// Login as an Employer/Employee
router.post('/sign-in',
    [
        check('password', 'Please enter a valid password').isLength({min: 1})
    ], authCtrl.signIn);

// Check if user logged In
router.post('/check', token, authCtrl.checkAuth);

// Export API routes
module.exports = router;