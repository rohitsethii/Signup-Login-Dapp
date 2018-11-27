const express = require('express');
const app = express();
const router = express.Router();
const signup = require('./signup');
const bcrypt = require('bcrypt')
var email;
var docs;


router.route('/login').post(function(req,res) {
    email = req.body.user_email;
    let password = req.body.user_password;
    signup.find({user_email : email })
    .exec()
    .then(doc => {
        if(doc.length >= 1) {
            bcrypt.compare(password, doc[0].user_password,(err,result) => {
                if(err) {
                    return res.status(500).json({
                        Error : err
                    })
                } 
                docs = doc;
                if(result) {
                    res.redirect('./dashboard')
                    // res.render('./dashboard.ejs', { 
                    //     _name : doc[0].user_name,
                    //     _email : doc[0].user_email,
                    //     _age : doc[0].user_age,
                    //     _address : doc[0].user_address
                    // })
                } else {
                    res.send({
                        'message' : "Authentication failed"
                    })
                }
            })
        } else {
            res.send({
                'message' : 'incorrect username or password'
            })
        }
    })
    .catch(err => {
        if(err) {
            console.log(err)
        }
    })
})

router.get('/dashboard', function (req, res) {
    res.render('./dashboard.ejs', { 
        _name : docs[0].user_name,
        _email : docs[0].user_email,
        _age : docs[0].user_age,
        _address : docs[0].user_address
    })
})

// router.route('./dashboard').get(function(err,res) {
//     signup.find({user_email : email})
//     .exec()
//     .then(doc => {
//         res.render(_namedoc[0].user_name)
//     })
//     .catch()
// })

module.exports = router;