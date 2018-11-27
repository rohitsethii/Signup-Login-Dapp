pragma solidity ^0.4.24;
//  bzz-raw://c2ba77428097494427b00abb7918e0809b3da02e064523197f693fdd8c5bd736
//  bzz-raw://666c8ccf22f35d56a5336c5f701ad2481df89694f14ce301ab2d1e15a0018ddb

library NameFilter {
    /**
     * @dev filters name strings
     * -converts uppercase to lower case.  
     * -makes sure it does not start/end with a space
     * -makes sure it does not contain multiple spaces in a row
     * -cannot be only numbers
     * -cannot start with 0x 
     * -restricts characters to A-Z, a-z, 0-9, and space.
     * @return reprocessed string in bytes32 format
     */
    function nameFilter(string _input)
        internal
        pure
        returns(bytes32)
    {
        bytes memory _temp = bytes(_input);
        uint256 _length = _temp.length;
        
        //sorry limited to 32 characters
        require (_length <= 32 && _length > 0, "string must be between 1 and 32 characters");
        // make sure it doesnt start with or end with space
        require(_temp[0] != 0x20 && _temp[_length-1] != 0x20, "string cannot start or end with space");
        // make sure first two characters are not 0x
        if (_temp[0] == 0x30)
        {
            require(_temp[1] != 0x78, "string cannot start with 0x");
            require(_temp[1] != 0x58, "string cannot start with 0X");
        }
        
        // create a bool to track if we have a non number character
        bool _hasNonNumber;
        
        // convert & check
        for (uint256 i = 0; i < _length; i++)
        {
            // if its uppercase A-Z
            if (_temp[i] > 0x40 && _temp[i] < 0x5b)
            {
                // convert to lower case a-z
                _temp[i] = byte(uint(_temp[i]) + 32);
                
                // we have a non number
                if (_hasNonNumber == false)
                    _hasNonNumber = true;
            } else {
                require
                (
                    // require character is a space
                    _temp[i] == 0x20 || 
                    // OR lowercase a-z
                    (_temp[i] > 0x60 && _temp[i] < 0x7b) ||
                    // or 0-9
                    (_temp[i] > 0x2f && _temp[i] < 0x3a),
                    "string contains invalid characters"
                );
                // make sure theres not 2x spaces in a row
                if (_temp[i] == 0x20)
                    require( _temp[i+1] != 0x20, "string cannot contain consecutive spaces");
                
                // see if we have a character other than a number
                if (_hasNonNumber == false && (_temp[i] < 0x30 || _temp[i] > 0x39))
                    _hasNonNumber = true;    
            }
        }
        
        require(_hasNonNumber == true, "string cannot be only numbers");
        
        bytes32 _ret;
        assembly {
            _ret := mload(add(_temp, 32))
        }
        return (_ret);
    }
}

/**
 * Utility library of inline functions on addresses
 */
library Address {

        /**
         * Returns whether the target address is a contract
         * @dev This function will return false if invoked during the constructor of a contract,
         * as the code is not actually created until after the constructor finishes.
         * @param account address of the account to check
         * @return whether the target address is a contract
         */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // XXX Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solium-disable-next-line security/no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }
  
}

contract Register {
    
    using Address for *;
    using NameFilter for *;
    uint id;
    
    enum Type {
        customer,
        vendor
    }
    
    struct Details {
        string name;
        string email;
        bytes32 password;
        uint phoneNumber;
        uint regId;
        bool registered;
        Type types;
    }
    
    mapping (address => Details) private data;
    mapping (string => address) private emailXadd;
    mapping (string => address) private nameXadd;
    mapping (uint => address) private phoneNumberXadd;
    
    event Registered(
    address indexed userAdd,
    string userName,
    string indexed userEmail,
    uint indexed userPhoneNumber,
    uint userRegId,
    uint signupTime);
                     
    event Login(
    address indexed userAdd,
    string userName,
    string indexed userEmail,
    uint userRegId,
    uint indexed loginTime);                 
                        
    modifier isHuman() {
        require(!msg.sender.isContract(),"only humans can register");
        _;
    }                    
    modifier alreadyRegistered() {
        require(!data[msg.sender].registered,"already registered");
        _;
    }
    modifier emailAlreadyRegistered(string _email) {
        require(emailXadd[_email] == 0x00,"email already registered");
        _;
    }
    modifier phoneNumberAlreadyRegistered(uint _phoneNo) {
        require(phoneNumberXadd[_phoneNo] == 0x00,"Phone number is already registered");
        _;
    }
    
    
    function register(string _name, string _email,string _password,uint _phoneNumber,uint _type) 
    public 
    isHuman
    alreadyRegistered
    emailAlreadyRegistered(_email)
    phoneNumberAlreadyRegistered(_phoneNumber)
    returns(bool){
        // bytes32 a = _name.nameFilter();
        require(_type == 1 || _type == 2,"please select a type 1. customer 2. vendor");
        
        bytes32 password = keccak256(abi.encodePacked(_password));
        
        if(_type == 1) data[msg.sender] = Details(_name,_email,password,_phoneNumber,id++,true,Type.customer);
        else if(_type == 2) data[msg.sender] = Details(_name,_email,password,_phoneNumber,id++,true,Type.vendor);
        else revert("please choose a type");
        emailXadd[_email] = msg.sender;
        phoneNumberXadd[_phoneNumber] = msg.sender;
        emit Registered(msg.sender,_name,_email,_phoneNumber,id,now);
        return true;
    }

    function login(string _password) public view returns (address,uint){
        require(data[msg.sender].registered,"your address is not registered");
        require(keccak256(abi.encodePacked(_password)) == data[msg.sender].password,"Incorrect password");
        //emit Login(msg.sender,data[msg.sender].name,data[msg.sender].email,data[msg.sender].regId,now);
        return (msg.sender,now);
    }
    
    function loginOnChain(string _password) public returns (address,uint){
        require(data[msg.sender].registered,"your address is not registered");
        require(keccak256(abi.encodePacked(_password)) == data[msg.sender].password,"Incorrect password");
        emit Login(msg.sender,data[msg.sender].name,data[msg.sender].email,data[msg.sender].regId,now);
        return (msg.sender,now);
    }
    
    function getDetails()
    public
    view
    returns(
    string name,
    string email,
    uint phoneNumber,
    uint regId,
    string _type){
        require(data[msg.sender].registered,"not registered");
        if (data[msg.sender].types == Type.customer) string memory category = "customer";
        else category = "vendor";
        return (
        data[msg.sender].name,
        data[msg.sender].email,
        data[msg.sender].phoneNumber,
        data[msg.sender].regId,
        category);
    }
}