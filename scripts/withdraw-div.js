const { ethers, getNamedAccounts } = require("hardhat")
const GCPropTokenABI = require("../artifacts/contracts/GCPropToken.sol/GCPropToken.json").abi

async function withdrawDiv() {
    const { deployer } = await getNamedAccounts()

    const [deployerSigner, account1] = await ethers.getSigners()
    const acc1Address = account1.address
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    console.log("Getting contract...")
    const gcTokenContract = await ethers.getContract("GCPropToken", deployer)
    const gcTokenContractAcc1 = await ethers.getContract("GCPropToken", acc1Address)

    // const deployerAccount = deployer.address
    console.log("Getting signer and connecting...")
    // const deployerSigner = ethers.provider.getSigner(deployerAccount)
    const contractWithSigner = gcTokenContract.connect(deployerSigner)
    const contractWithSignerAcc1 = gcTokenContractAcc1.connect(account1)

    console.log("Withdraw Dividend...")
    const tx = await contractWithSigner.withdrawDiv()
    const txAcc1 = await contractWithSignerAcc1.withdrawDiv()

    await tx.wait(1)
    await txAcc1.wait(1)

    // console.log("TX: ", tx)
    console.log("Withdraw Dividend!")

    console.log("Deployer: " + deployer)
    const balance = await ethers.provider.getBalance(deployer)
    console.log("balance of deployer: " + ethers.utils.formatEther(balance)) // 0

    const balanceOfAcc1 = await ethers.provider.getBalance(acc1Address)
    console.log("balance of Acc1: " + ethers.utils.formatEther(balanceOfAcc1))
}

withdrawDiv()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
