const db = require('../connection/db');

// Schema for Users
const usersSchema = db.Schema({
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
    }
})

//Creating the collection Users
const Users = db.model('Users', usersSchema);

module.exports = Users;