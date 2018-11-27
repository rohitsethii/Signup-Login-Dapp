const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const signup = require('./signup');
// const fs = require('fs')
// const contract = require('truffle-contract')
// const Web3 = require('web3');  
// const http = require('http') 
// const abi = [
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "name": "userAdd",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "name": "userName",
//           "type": "string"
//         },
//         {
//           "indexed": true,
//           "name": "userEmail",
//           "type": "string"
//         },
//         {
//           "indexed": true,
//           "name": "userPhoneNumber",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "name": "userRegId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "name": "signupTime",
//           "type": "uint256"
//         }
//       ],
//       "name": "Registered",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "name": "userAdd",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "name": "userName",
//           "type": "string"
//         },
//         {
//           "indexed": true,
//           "name": "userEmail",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "name": "userRegId",
//           "type": "uint256"
//         },
//         {
//           "indexed": true,
//           "name": "loginTime",
//           "type": "uint256"
//         }
//       ],
//       "name": "Login",
//       "type": "event"
//     },
//     {
//       "constant": false,
//       "inputs": [
//         {
//           "name": "_name",
//           "type": "string"
//         },
//         {
//           "name": "_email",
//           "type": "string"
//         },
//         {
//           "name": "_password",
//           "type": "string"
//         },
//         {
//           "name": "_phoneNumber",
//           "type": "uint256"
//         },
//         {
//           "name": "_type",
//           "type": "uint256"
//         }
//       ],
//       "name": "register",
//       "outputs": [
//         {
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "payable": false,
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "constant": true,
//       "inputs": [
//         {
//           "name": "_password",
//           "type": "string"
//         }
//       ],
//       "name": "login",
//       "outputs": [
//         {
//           "name": "",
//           "type": "address"
//         },
//         {
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "payable": false,
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "constant": false,
//       "inputs": [
//         {
//           "name": "_password",
//           "type": "string"
//         }
//       ],
//       "name": "loginOnChain",
//       "outputs": [
//         {
//           "name": "",
//           "type": "address"
//         },
//         {
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "payable": false,
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "constant": true,
//       "inputs": [],
//       "name": "getDetails",
//       "outputs": [
//         {
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "name": "email",
//           "type": "string"
//         },
//         {
//           "name": "phoneNumber",
//           "type": "uint256"
//         },
//         {
//           "name": "regId",
//           "type": "uint256"
//         },
//         {
//           "name": "_type",
//           "type": "string"
//         }
//       ],
//       "payable": false,
//       "stateMutability": "view",
//       "type": "function"
//     }
//   ]
// if (typeof web3 !== 'undefined') {
//     var Provider = web3.currentProvider;
//     web3 = new Web3(Provider);
//     console.log(web3.currentProvider)
//     var web3 = new Web3(new web3.providers.HttpProvider(provider));
// } 
// else {
//     // If no injected web3 instance is detected, fall back to Ganache
//     var Provider= new Web3.providers.HttpProvider('http://localhost:8545');
//     web3 = new Web3(Provider);
// // }
// const providers = require('../../truffle');
// console.log(providers.networks.provider)
app.set('views', './public' + 'views');
app.set('view engine','ejs'); 

router.route('/signup').post(function(req,res) {
    signup.find({user_email : req.body.user_email})
    .exec()
    .then(details => {
        if(details.length >= 1){
            res.status(409).json({
                'message' : 'MailId already exits'
            });    
        } else {
            bcrypt.hash(req.body.user_password,10,(err,hash) => {
                if(err){
                    return res.status(500).json({
                        error : err
                    })
                } else {

		            // if (typeof web3 !== 'undefined') {
		            // 	var Provider = web3.currentProvider;
                    //     var web3 = new Web3(Provider);
                    //     console.log(Provider)
		            // } 
		            // // else {
                //         web3 = new Web3(Web3.HttpProviders.currentProvider);
                //         var registerInstance = web3.eth.contract(abi).at('0x38e195fa3145fb56f6b70c8ff229871de614e8a0');
                //         // console.log(registerInstance)		            }
                //         console.log(req.body)
                //         console.log(web3.eth.accounts)
                //         registerInstance.register(req.body.user_name,req.body.user_email,req.body.user_password,req.body.user_phoneNumber,1).then(function(receipt){
                //             console.log(receipt);
                //             })		

                    const details = new signup({
                        user_name : req.body.user_name,
                        user_email : req.body.user_email,
                        user_password : hash,
                        user_age : req.body.user_age,
                        user_address : req.body.user_address
                    });
                    details.save().
                    then(details => {
                        res.redirect('/login');
                        
                        //  res.render('./login.ejs');  
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).send("unable to save signup details into database");
                    })
                        }
                    // }
                })
                }
            })
    .catch(err = {
        if(err){
            res.status(500).json({
                'error' : err
            })
        }
    })
})

// router.route('/').get(function (req, res) {
//     signup.find(function (err, userdetails) {
//       if(err){
//         console.log(err);
//       }
//       else {
//         res.json(userdetails);
//       }
//     });
// });
router.get('/login', function (req, res) {
    res.render('./login.ejs');
})
module.exports = router;