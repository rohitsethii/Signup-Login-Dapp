var Web3 = require('web3')
var EthereumTx = require('ethereumjs-tx')
var contractAddress = "0x200692e556b8dc0eccdb8a353f92556f2491e6fd";
var abiArray = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "userAdd",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "userName",
          "type": "string"
        },
        {
          "indexed": true,
          "name": "userEmail",
          "type": "string"
        },
        {
          "indexed": true,
          "name": "userPhoneNumber",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "userRegId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "signupTime",
          "type": "uint256"
        }
      ],
      "name": "Registered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "userAdd",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "userName",
          "type": "string"
        },
        {
          "indexed": true,
          "name": "userEmail",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "userRegId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "loginTime",
          "type": "uint256"
        }
      ],
      "name": "Login",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_email",
          "type": "string"
        },
        {
          "name": "_password",
          "type": "string"
        },
        {
          "name": "_phoneNumber",
          "type": "uint256"
        },
        {
          "name": "_type",
          "type": "uint256"
        }
      ],
      "name": "register",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_password",
          "type": "string"
        }
      ],
      "name": "login",
      "outputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_password",
          "type": "string"
        }
      ],
      "name": "loginOnChain",
      "outputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getDetails",
      "outputs": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "email",
          "type": "string"
        },
        {
          "name": "phoneNumber",
          "type": "uint256"
        },
        {
          "name": "regId",
          "type": "uint256"
        },
        {
          "name": "_type",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
var from = "rinkeby address";
var privateKey = "private key";

var web3 = new Web3(new Web3.providers.HttpProvider("infura key"));
var contract = web3.eth.contract(abiArray).at(contractAddress);


  var number = web3.eth.blockNumber;
  var count = web3.eth.getTransactionCount(from);
  var rawTransaction = {
          "from": from,
          "nonce": web3.toHex(count), 
          "gasPrice": web3.toHex(10000000000),
          "gasLimit": web3.toHex(500000),
          "to": contractAddress, 
          "data": contract.register.getData("name","email","password",12345,1,{
                  from: from
                  }),
          "chainId": "0x04" //rinkeby id 
  }

  var privKey = new Buffer(privateKey, 'hex');
  console.log("transaction count is", count);
  var tx = new EthereumTx(rawTransaction);

  tx.sign(privKey);
  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        if (!err)
            console.log("transaction hash", hash);
        else
            console.log(err)
  });
