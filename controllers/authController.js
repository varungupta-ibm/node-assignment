const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { encodePassword } = require("./commonController");

const Users = require('../models/users');

exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const email = req.body.email || '';
    const phone = req.body.phone || '';
    const password = req.body.password;
    const name = req.body.name || '';
    const utype = req.body.type || '';
    const adminId = req.body.adminId || '';

    let user = await Users.findOne({
        email: email
    });

    if (user) {
        return res.status(400).json({
            status: 400,
            msg: "User already exists. Please try loggin in with your account credentials."
        });
    }

    encodePassword(password, async (hashPass) => {
        try {

            let isVerified = false;
            if (utype === "EMPLOYER") {
                isVerified = true;
            }

            user = new Users({
                email: email,
                token: hashPass,
                phone: phone,
                name: name,
                type: utype,
                adminId: adminId,
                verified: isVerified
            });

            await user.save().then((user) => {
                jwt.sign({ user: { id: user._id } }, "randomString", { expiresIn: 10000 },
                    (err, token) => {
                        if (err) {
                            console.error('ERR___', err);
                            res.status(500).json({
                                status: 500,
                                message: "Server Error !"
                            });
                        }
                        else {
                            let message = utype === "EMPLOYEE" ? "Please wait for your employer to get verified." : "Successfully registered as an Employer.";
                            if (utype === "EMPLOYEE") {
                                res.status(200).json({
                                    status: "PENDING",
                                    message: message
                                });
                            } else {
                                res.status(200).json({
                                    status: "SUCCESS",
                                    token: token,
                                    message: message
                                });
                            }
                            
                        }
                    }
                );
            }).catch((err) => {
                console.log(err._message)
                res.json({
                    status: 500,
                    message: "Couldn't register the user !"
                });
            })
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving | " + err.message);
        }
    });
};

exports.signIn = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { email, password } = req.body;
    try {
        let user = await Users.findOne({
            email: email
        });
        if (!user)
            return res.status(400).json({
                status: 400,
                message: "User doesn't exists."
            });

        const isMatch = await bcrypt.compare(password, user.token);
        if (!isMatch)
            return res.status(400).json({
                status: 400,
                message: "Password you have entered is incorrect."
            });

        if (!user.verified) {
            return res.status(400).json({
                status: 400,
                message: "Your account is not yet verified."
            });
        }

        const payload = {
            user: {
                _id: user._id
            }
        };

        jwt.sign(
            payload,
            "randomString",
            {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) throw err;
                res.set({
                    'auth-token': token
                });
                res.status(200).json({
                    status: 200,
                    message: "You are successfully logged into the application!",
                    token: token
                });
            }
        );
    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: 500,
            message: "Server Error"
        });
    }
};

exports.checkAuth = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        // request.user is getting fetched from Middleware after token authentication
        const user = await Users.findById(req.user.id);
        res.json(user);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: 500,
            message: "Server Error"
        });
    }
};