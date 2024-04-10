// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MyContract {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Transfer(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= _withdrawAmount, "Insufficient balance");
        balance -= _withdrawAmount;
        emit Withdraw(_withdrawAmount);
    }

    function transfer(address _to, uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_to != address(0), "Invalid address");
        require(balance >= _amount, "Insufficient balance");
        balance -= _amount;
        emit Transfer(_to, _amount);
    }

    function checkOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(newOwner != address(0), "Invalid address");
        address previousOwner = owner;
        owner = payable(newOwner);
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}
