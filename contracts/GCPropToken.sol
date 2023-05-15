// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GCPropToken is ERC20, Ownable {
    uint256 public totalSupplyLimit; // = 10 * (10 ** 18); // Total supply of tokens
    uint256 public tokenSalePrice; // Price of tokens during token sale

    uint256 public dividendPerToken; // Cumulative ether per token deposited
    mapping(address => uint256) dividendBalanceOf; // ether credited to each, not yet transferred
    mapping(address => uint256) dividendCreditedTo; //cumulative ether per token previously credited

    // mapping(address => uint256) balanceOf;

    constructor(uint256 _price, uint256 _totalSupplyLimit) ERC20("GC PropTokenTest2", "GCT") {
        tokenSalePrice = _price;
        totalSupplyLimit = _totalSupplyLimit;
    }

    function updateDiv(address account) internal {
        uint256 owed = dividendPerToken - dividendCreditedTo[account];
        if (owed > 0) {
            dividendBalanceOf[account] += balanceOf(account) * owed;
            dividendCreditedTo[account] = dividendPerToken;
        }
    }

    // Function to buy tokens during token sale
    function buyTokens(uint256 amount) external payable {
        require(msg.value == amount * tokenSalePrice, "Incorrect amount of Ether sent");
        require(totalSupply() + amount <= totalSupplyLimit, "Total supply exceeded");
        updateDiv(msg.sender);
        _mint(msg.sender, amount);
    }

    // Function to withdraw accumulated FUNDs from the contract
    function withdrawFunds() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to withdraw Ether from contract");
    }

    // Function to withdraw DIVIDENDs
    function withdrawDiv() public {
        updateDiv(msg.sender);
        uint256 amount = dividendBalanceOf[msg.sender];
        dividendBalanceOf[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to withdraw divend from contract");
    }

    // Function to deposit DIVIDENDs
    function deposit() public payable {
        dividendPerToken += msg.value / totalSupply(); // ignoring remainder
    }

    // tranfer override to update, calling super
    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = msg.sender;
        updateDiv(owner);
        updateDiv(to);
        super.transfer(to, amount);
        return true;
    }

    // tranferFrom override to update, calling super
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        updateDiv(from);
        updateDiv(to);
        super.transferFrom(from, to, amount);
        return true;
    }

    function getTokenPrice() public view returns (uint256) {
        return tokenSalePrice;
    }

    function getSupplyLimit() public view returns (uint256) {
        return totalSupplyLimit;
    }
}
