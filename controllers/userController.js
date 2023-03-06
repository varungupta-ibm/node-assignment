const Users = require('../models/users');

exports.addUser = async (req, res) => {

    if (req.body
        && Object.keys(req.body).length
        && Object.getPrototypeOf(req.body) === Object.prototype) {

        const userName = req.body.name,
            userEmail = req.body.email,
            userPhone = req.body.phone,
            userType = req.body.type,
            adminId = req.body.adminId || ''

        const newUser = new Users({
            name: userName,
            email: userEmail,
            phone: userPhone,
            type: userType,
            adminId: adminId
        })

        await newUser.save().then((user) => {
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

exports.verifyEmployee = async (req, res) => {

    const getUser = await Users.findOne({ _id: req.params.id });
    if (getUser && getUser.type === "EMPLOYEE") {

        getUser.verified = true;
        await getUser.save().then(() => {
            res.json({
                status: 200,
                message: "User verified sucessfully."
            });
        }).catch((err) => {
            console.log(err);
            res.json({
                status: 500,
                message: "Couldn't verify the user !"
            });
        })
    } else {
        return res.status(400).json({
            status: 400,
            message: "Not a valid user !"
        });
    }
};

exports.updateUser = async (req, res) => {

    const getUser = await Users.findOne({ _id: req.params.id });
    if (getUser) {

        if (req.body.name) getUser.name = req.body.name
        if (req.body.email) getUser.email = req.body.email
        if (req.body.phone) getUser.phone = req.body.phone
        await getUser.save().then(() => {
            res.json({
                status: 200,
                message: "User sucessfully updated."
            });
        }).catch((err) => {
            console.log(err);
            res.json({
                status: 500,
                message: "Couldn't update the user !"
            });
        })
    } else {
        return res.status(400).json({
            status: 400,
            message: "Not a valid user !"
        });
    }
};

exports.deleteUser = (req, res) => {
    Users.remove({ _id: req.params.id }).then(() => {
        res.send('user deleted')
    }).catch((err) => {
        console.log(err)
    })
};

exports.getAllUsers = (req, res) => {

    if (req.body
        && Object.keys(req.body).length
        && Object.getPrototypeOf(req.body) === Object.prototype) {

        const userType = req.body.userType || '';
        const adminId = req.body.adminId || '';

        let getUserList;
        if (userType === "EMPLOYER") {
            getUserList = Users.find({ type: userType });
        } else {
            getUserList = Users.find({ adminId: adminId, type: userType });
        }

        getUserList.then(response => {
            let usrArr = [];
            if (response && response.length) {
                response.forEach(user => {
                    let userObj = {
                        "id": user._id,
                        "name": user.name,
                        "email": user.email,
                        "phone": user.phone,
                        "type": user.type,
                        "verified": user.verified,
                        "adminId": user.adminId
                    };
                    usrArr.push(userObj);
                });
            }
            res.json({
                status: 200,
                data: usrArr
            });
        })
            .catch(err => {
                console.log(err);
                res.json({
                    status: 500,
                    message: "Couldn't get the user !"
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