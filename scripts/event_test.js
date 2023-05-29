const { ethers, getNamedAccounts } = require("hardhat")
const GCPropTokenABI = require("../artifacts/contracts/GCPropToken.sol/GCPropToken.json").abi

async function eventTest() {
    const { deployer } = await getNamedAccounts()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const gcTokenContract = await ethers.getContractAt(GCPropTokenABI, contractAddress)
    const contractAccount = gcTokenContract.address
    const deployerAccount = deployer.address
    gcTokenContract.on("UpdatedDiv", (deployerAccount, amount) => {
        console.log("UpdatedDiv event: " + deployerAccount + " / " + amount)
    })
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout!"), 50000)

        const test = gcTokenContract.on("UpdatedDiv", (account, amount) => {
            console.log("UpdatedDiv event: " + account + " / " + amount)
            resolve()
        })
    })

    console.log("Testing...")
}

eventTest()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
