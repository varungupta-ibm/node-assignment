const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

/**
 * Common methods
 * --------------
 */

const generateToken = (req, res, next) => {
    const token = req.header("user-token");
    if (!token) return res.status(401).json({ message: "You are not authorised to do this action." });

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Your session has been expired." });
    }
}

// hash the password when creating a new user in the database
const encodePassword = (password, callback) => {
    bcrypt.hash(password, salt, function (err, hash) {
        callback(hash);
    });
}

module.exports.token = generateToken;
module.exports.encodePassword = encodePassword;