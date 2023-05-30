const { ethers, getNamedAccounts } = require("hardhat")
const GCPropTokenABI = require("../artifacts/contracts/GCPropToken.sol/GCPropToken.json").abi

async function withdrawDiv() {
    const { deployer } = await getNamedAccounts()

    const signers = await ethers.getSigners()
    const acc2signer = signers[2]
    // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    console.log("Getting contract...")
    const gcTokenContract = await ethers.getContract("GCPropToken")

    console.log("Getting signer and connecting...")
    // const deployerSigner = ethers.provider.getSigner(deployerAccount)
    const contractWithSigner = gcTokenContract.connect(acc2signer)
    const balanceb4 = await ethers.provider.getBalance(acc2signer.address)
    console.log("balance of Acc2(b4): " + ethers.utils.formatEther(balanceb4))

    console.log("Withdraw Dividend...")
    const tx = await contractWithSigner.withdrawDiv()

    await tx.wait(1)

    console.log("Acc2: " + acc2signer.address)
    const balance = await ethers.provider.getBalance(acc2signer.address)
    console.log("balance of Acc2(Af): " + ethers.utils.formatEther(balance)) // 0
    console.log("Added Fund: " + (balance - balanceb4))
}

withdrawDiv()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
