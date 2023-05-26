const { ethers, getNamedAccounts } = require("hardhat")

async function sendDivToken() {
    const { deployer } = await getNamedAccounts()
    const gcTokenContract = await ethers.getContract("GCPropToken")
    const contractAccount = gcTokenContract.address
    const deployerAccount = deployer.address
    const tx = await gcTokenContract.deposit({ value: ethers.utils.parseEther("1") })
    await tx.wait(1)
    console.log("Dividend sent!")
    const divPerUser = await gcTokenContract.getDivBalanceOf(deployer)
    // //const contractBalance = await gcTokenContract.balanceOf(contractAccount)
    // console.log("Dividend per user(deployer): " + divPerUser)
    // const divPerUserValue = divPerUser.toString()
    // console.log("Dividend per user(deployer): " + divPerUserValue)
    // console.log("contract.balance: " + (await ethers.provider.getBalance(contractAccount)))
    // const divPerUser1 = await gcTokenContract.getDivBalanceOf(deployer)
    // console.log("divPerUser1:", divPerUser1)
    // const divPerUser2 = await gcTokenContract.getDivBalanceOf(deployer)
    // const divPerUserBalance2 = divPerUser2.data // Replace `data` with the correct property name
    // console.log("Dividend per use2r(deployer): " + divPerUserBalance2.toString())
    // // const divPerUserBalanceHex = divPerUser2.data // Replace `data` with the correct property name
    // const divPerUserBalance3 = parseInt(divPerUserBalance2, 16)
    // console.log("Dividend per user3(deployer): " + divPerUserBalance3)
    const data = divPerUser.data
    const abi = ["function getDivBalanceOf(address account) public returns (uint256)"]
    const iface = new ethers.utils.Interface(abi)
    const deployerAddress = ethers.utils.getAddress(deployer)

    try {
        const decodedData = iface.decodeFunction("getDivBalanceOf", deployerAddress)
        console.log(decodedData)
    } catch (error) {
        console.error("Call reverted. Reason:", error.reason)
    }

    // console.log("Decoded Data:", decodedData)
    console.log("test: " + ethers.BigNumber.from(data))
    // console.log("Dividend per user(deployer): " + ethers.utils.formatEther(divPerUserBalance))
    // console.log("Contract balance: " + contractBalance.toString())
    console.log("diviend per totken: " + (await gcTokenContract.dividendPerToken()).toString())
    console.log((await gcTokenContract.tokenSalePrice()).toString())
    console.log((await gcTokenContract.totalSupply()).toString())
    // const contractABI = [
    //     {
    //         name: "getDivBalanceOf",
    //         inputs: [
    //             {
    //                 type: "address",
    //                 name: "account",
    //             },
    //         ],
    //         outputs: [
    //             {
    //                 type: "uint256",
    //                 name: "",
    //             },
    //         ],
    //         constant: true,
    //         payable: false,
    //         type: "function",
    //     },
    // ]
    // const decodedData = ethers.utils.defaultAbiCoder.decode(abi, data)
}
sendDivToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
