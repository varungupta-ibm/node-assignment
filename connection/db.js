const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/nodeAssignment',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to db')
    }).catch((error) => {
        console.log(error)
    });

module.exports = mongoose;