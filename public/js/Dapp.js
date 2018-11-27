App = {
  web3Provider: null,
  contracts: {},
  accounts: [],
  
  init: function() {
    App.contracts.Register = TruffleContract(register);
    return App.initWeb3();
  },
  initWeb3: function() {

		if (typeof web3 !== 'undefined') {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} 
		else {
			// If no injected web3 instance is detected, fall back to Ganache
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
			web3 = new Web3(App.web3Provider);
		}

		accounts = web3.eth.accounts;
		console.log(accounts);

	  return App.getDetails();
  },
  Signup : function() {
    var _name = $('#name').val();
    var _email = $('#mail').val();
    var _password = $('#password').val();
    var _phoneNo = $('#phoneNumber').val();
    var _type = $("input[name='Type']:checked").val();

    App.contracts.Register.setProvider(App.web3Provider);
    App.contracts.Register.deployed().then(function(registerInstance) {
      registerInstance.register(_name,_email,_password,_phoneNo,_type).then(function(receipt){
        console.log(receipt)
       })
       return App.getDetails();
    })
  },

  login : function() {
    App.contracts.Register.setProvider(App.web3Provider);
    App.contracts.Register.deployed().then(function(registerInstance) {
      registerInstance.loginOnChain().then(function(receipt){
        console.log(receipt)
      })
    })
  },

  getDetails : function() {

    App.contracts.Register.setProvider(App.web3Provider);
    App.contracts.Register.deployed().then(function(registerInstance) {
      registerInstance.getDetails().then(function(receipt){
        console.log(receipt)
       })
    })
  },
}
$(function() {
	$(window).load(function() {
    App.init();
  })
  $('#register').on('click',function(){
		App.Signup();
	})
  $('#login').on('click',function(){
		App.login();
	})
})