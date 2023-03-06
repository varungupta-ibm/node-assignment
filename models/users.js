const db = require('../connection/db');

// Schema for Employees
const userSchema = db.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Users = db.model('Users', userSchema);
module.exports = Users;
