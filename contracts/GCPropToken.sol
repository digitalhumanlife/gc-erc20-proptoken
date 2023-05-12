// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GCPropToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 10 * (10 ** 18); // Total supply of tokens
    uint256 public tokenSalePrice; // Price of tokens during token sale
    uint256 public contractBalance; // Accumulated funds in the contract

    uint256 public dividendPerToken;
    mapping(address => uint256) dividendBalanceOf;
    mapping(address => uint256) dividendCreditedTo;

    // mapping(address => uint256) balanceOf;

    constructor(uint256 price) ERC20("GC PropTokenTest1", "GCT") {
        tokenSalePrice = price;
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
        require(
            msg.value == amount * tokenSalePrice,
            "Incorrect amount of Ether sent"
        );
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            "Total supply exceeded"
        );
        updateDiv(msg.sender);
        _mint(msg.sender, amount);
    }

    // Function to withdraw accumulated funds from the contract
    function withdrawFunds() external onlyOwner {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }

    // Function to fund the contract if it is empty
    function fundContract() external payable {
        uint256 amount = address(this).balance;
        amount += msg.value;
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        address owner = msg.sender;
        updateDiv(owner);
        updateDiv(to);
        super.transfer(to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        updateDiv(from);
        updateDiv(to);
        super.transferFrom(from, to, amount);
        return true;
    }

    function deposit() public payable {
        dividendPerToken += msg.value / totalSupply(); // ignoring remainder
    }

    function withdrawDiv() public {
        updateDiv(msg.sender);
        uint256 amount = dividendBalanceOf[msg.sender];
        dividendBalanceOf[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
