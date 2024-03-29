// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

////////////////////////////////////////////////
// REMOVE BEFORE DEPLOYMENT TO LIVE NETWORK   //
// !! Refactor the visibility of variables    //
// !! variables of the getter functions       //
////////////////////////////////////////////////
import "hardhat/console.sol";

contract GCPropToken is ERC20Votes, Ownable {
    uint256 public totalSupplyLimit; // = 10 * (10 ** 18); // Total supply of tokens
    uint256 public tokenSalePrice; // Price of tokens during token sale
    uint256 public minimumQuantity; // Minimum quantity of tokens to buy

    uint256 public dividendPerToken; // Cumulative ether per token deposited
    mapping(address => uint256) dividendBalanceOf; // ether credited to each, not yet transferred
    mapping(address => uint256) dividendCreditedTo; //cumulative ether per token previously credited

    // mapping(address => uint256) balanceOf;
    event UpdatedDiv(address indexed account, uint256 amount);

    constructor(
        uint256 _price,
        uint256 _totalSupplyLimit,
        uint256 _minQuantity
    ) ERC20("GC PropTokenTest2", "GCT") ERC20Permit("GC PropTokenTest2") {
        tokenSalePrice = _price;
        totalSupplyLimit = _totalSupplyLimit;
        minimumQuantity = _minQuantity;
    }

    function updateDiv(address account) internal {
        uint256 owed = dividendPerToken - dividendCreditedTo[account];
        console.log("DivPerToken(checking): ", dividendPerToken);
        console.log("DivCreditedTo(checking): ", dividendCreditedTo[account]);
        console.log("Owed(checking): ", owed);

        if (owed > 0) {
            dividendBalanceOf[account] += ((balanceOf(account) * owed) / (minimumQuantity ** 18));

            console.log("BalanceOf: ", balanceOf(account));
            console.log("DivBalanceOf: ", dividendBalanceOf[account]);

            dividendCreditedTo[account] = dividendPerToken;

            console.log("DivCreditedTo: ", dividendCreditedTo[account]);

            uint256 updatedDiv = dividendBalanceOf[account]; //+ balanceOf(account) * owed;
            emit UpdatedDiv(account, updatedDiv);

            ////////////////////////////////////////////////
            // REMOVE BEFORE DEPLOYMENT TO LIVE NETWORK   //
            ////////////////////////////////////////////////
            console.log("Event fired(Updated): ", updatedDiv);
        }
    }

    // Function to buy tokens during token sale
    function buyTokens(uint256 amount) external payable {
        require(msg.value == amount * tokenSalePrice, "Incorrect amount of Ether sent");
        require(totalSupply() + amount <= totalSupplyLimit, "Total supply exceeded");
        require(amount >= minimumQuantity, "Minimum quantity not met");
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
        ////////////////////////////////////////////////
        // REMOVE BEFORE DEPLOYMENT TO LIVE NETWORK   //
        ////////////////////////////////////////////////
        console.log("Withdrawing for: ", msg.sender);

        uint256 amount = dividendBalanceOf[msg.sender];

        ////////////////////////////////////////////////
        // REMOVE BEFORE DEPLOYMENT TO LIVE NETWORK   //
        ////////////////////////////////////////////////
        console.log("Amount: ", amount);

        dividendBalanceOf[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to withdraw dividend of contract");
    }

    // Function to deposit DIVIDENDs
    function deposit() public payable {
        ////////////////////////////////////////////////
        // REMOVE BEFORE DEPLOYMENT TO LIVE NETWORK   //
        ////////////////////////////////////////////////
        console.log("depositing %s", msg.value);

        dividendPerToken += (msg.value * (minimumQuantity ** 18)) / totalSupply(); // ignoring remainder

        console.log("totalSupply(): %s", totalSupply());
        console.log("dividendPerToken: %s", dividendPerToken);
        console.log("dividendPerToken From Console: ", msg.value / totalSupply());
    }

    // tranfer override to update, calling super
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(amount >= minimumQuantity, "Minimum quantity not met");
        address owner = msg.sender;
        updateDiv(owner);
        updateDiv(to);
        super.transfer(to, amount);
        return true;
    }

    // tranferFrom override to update, calling super
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(amount >= minimumQuantity, "Minimum quantity not met");
        updateDiv(from);
        updateDiv(to);
        super.transferFrom(from, to, amount);
        return true;
    }

    // Required Overrides for ERC20Votes
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }

    // Required Overrides for ERC20Votes <END>

    function getTokenPrice() public view returns (uint256) {
        return tokenSalePrice;
    }

    function getMinimumQuantity() public view returns (uint256) {
        return minimumQuantity;
    }

    function getSupplyLimit() public view returns (uint256) {
        return totalSupplyLimit;
    }

    function getTotalIssued() public view returns (uint256) {
        return totalSupply();
    }

    function getDivBalanceOf(address account) public returns (uint256) {
        updateDiv(account);
        uint256 amount = dividendBalanceOf[account];
        return amount;
    }
}
