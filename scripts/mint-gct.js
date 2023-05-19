const { ethers, getNamedAccounts } = require("hardhat")

async function mintgc() {
    //const tokenValue1 = 10 * 10 ** 18
    const numOfTokens = ethers.BigNumber.from(5)
    const tokenValue1 = ethers.utils.parseUnits(numOfTokens.toString(), 18)
    console.log("Token Value:", tokenValue1.toString())
    const accounts = await ethers.getSigners()

    const account1 = accounts[1]
    const account2 = accounts[2]
    const account3 = accounts[3]
    //const {deployer} = await getNamedAccounts()
    const gcToken1 = await ethers.getContract("GCPropToken", account1)
    const gcToken2 = await ethers.getContract("GCPropToken", account2)
    const gcToken3 = await ethers.getContract("GCPropToken", account3)
    console.log("Multiple contract connected...")
    const tx1 = await gcToken1.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx1.wait(1)
    console.log("mint1 completed! " + (await gcToken1.balanceOf(account1.address)).toString())

    const tx2 = await gcToken2.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx2.wait(1)
    console.log("mint2 completed! " + (await gcToken2.balanceOf(account2.address)).toString())

    const tx3 = await gcToken3.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx3.wait(1)
    console.log("mint3 completed! " + (await gcToken3.balanceOf(account3.address)).toString())

    const supply = await gcToken1.getSupplyLimit()
    console.log(supply.toString())
}

mintgc()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
