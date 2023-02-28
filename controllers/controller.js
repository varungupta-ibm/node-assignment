const Users = require('../models/models');

exports.addUser = (req, res) => {

    if (req.body
        && Object.keys(req.body).length
        && Object.getPrototypeOf(req.body) === Object.prototype) {
        console.log('____body', req.body);

        const userName = req.body.name,
            userEmail = req.body.email,
            userPhone = req.body.phone

        let newUser = new Users({
            name: userName,
            email: userEmail,
            phone: userPhone,
        })

        newUser.save().then((user) => {
            // res.send(user)
            res.json({
                status: 200,
                data: user
            });
        }).catch((err) => {
            console.log(err._message)
            res.status(500);
            res.json({
                status: 500,
                message: "Couldn't save the user !"
            });
        })
    } else {
        res.status(400);
        res.json({
            status: 400,
            message: "Parameters Missing."
        });
    }
};

exports.getAllUsers = (req, res) => {
    const usersList = Users.find();
    usersList.then(response => {
        res.json({
            status: 200,
            data: response
        });
    })
        .catch(err => {
            console.log(err);
            res.json({
                status: 500,
                message: "Couldn't get the user !"
            });
        })
};

exports.getUserList = (req, res) => {
    const usersList = Users.findById(req.params.id);
    usersList.then(response => {
        res.json({
            status: 200,
            data: response
        });
    })
        .catch(err => {
            console.log(err);
            res.json({
                status: 500,
                message: "Couldn't get the user !"
            });
        })
};

exports.updateUser = (req, res) => {
    let address = {}
    if (req.body.name) address.name = req.body.name
    if (req.body.email) address.email = req.body.email
    if (req.body.phone) address.phone = req.body.phone
    Users.update({ _id: req.params.id }, address).then(() => {
        res.send(address);
    }).catch((err) => {
        console.log(err);
        res.json({
            status: 500,
            message: "Couldn't update the user !"
        });
    })
};

exports.deleteUser = (req, res) => {
    Users.remove({ _id: req.params.id }).then(() => {
        res.send('user deleted')
    }).catch((err) => {
        console.log(err)
    })
};