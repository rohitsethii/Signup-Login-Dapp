const express = require('express');
const app = express();
const router = express.Router();
const signup = require('./signup');


router.route('/').get(function(req,res) {
    let name = req.body.user_name;
    let email = req.body.user_email;
    let age = req.body.user_age;
    let address = req.body.user_address;

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
                if(result) {
                    res.render('./dashboard.ejs')
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

module.exports = router;