const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(express.static('./public'));
const config = require('./public/js/db');
const Signup = require('./public/js/signupRoute')
const Login = require('./public/js/loginRoute')
const PORT = 7002;

mongoose.connect(config.DB).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' +err)
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static('./public'));
app.use('/', Signup);
app.use('/', Login)

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT: ',PORT);
});
