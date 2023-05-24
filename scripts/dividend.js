const { ethers, getNamedAccounts } = require("hardhat")

async function sendDivToken() {
    const { deployer } = await getNamedAccounts()
    const gcTokenContract = await ethers.getContract("GCPropToken", deployer)
    const contractAccount = gcTokenContract.address
    const tx = await gcTokenContract.deposit({ value: "10000000000000000" })
    await tx.wait(1)
    console.log("Dividend sent!")
    const divPerUser = await gcTokenContract.getDivBalanceOf(deployer)
    const contractBalance = await gcTokenContract.balanceOf(contractAccount)
    console.log("Dividend per user: " + divPerUser.toString())
    console.log("Contract balance: " + contractBalance.toString())
}
sendDivToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
