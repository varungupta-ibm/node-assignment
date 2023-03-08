const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const _PORT = 8080;
const apiRoutes = require('./routers/routers');

// Use Api routes in the App
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use('/api', apiRoutes)

app.listen(_PORT, () => {
    console.log('sever listening on port:' + _PORT);
});