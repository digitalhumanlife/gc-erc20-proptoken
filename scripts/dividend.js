const { ethers, getNamedAccounts } = require("hardhat")

async function sendDivToken() {
    const { deployer } = await getNamedAccounts()
    const gcTokenContract = await ethers.getContract("GCPropToken", deployer)
    const contractAccount = gcTokenContract.address
    const tx = await gcTokenContract.deposit({ value: ethers.utils.parseEther("10") })
    const txReceipt = await tx.wait(1)
    console.log("Deposit completed! ") //+ txReceipt.events[0].args[0].toString())
    console.log("TxR: " + txReceipt)
    console.log("Tx: " + tx)

    console.log("Diviend/token: " + (await gcTokenContract.dividendPerToken()))
    console.log("Total Supply: " + (await gcTokenContract.totalSupply()).toString())
    console.log("Contract.balance: " + (await ethers.provider.getBalance(contractAccount)))
    const balance = await ethers.provider.getBalance(deployer)
    console.log("balance of deployer: " + ethers.utils.formatEther(balance))

    const accounts = await ethers.getSigners()
    const balanceOfAcc1 = await ethers.provider.getBalance(accounts[1].address)
    console.log("balance of Acc1: " + ethers.utils.formatEther(balanceOfAcc1))
}
sendDivToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
