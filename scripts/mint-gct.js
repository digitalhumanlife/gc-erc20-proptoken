const { ethers, getNamedAccounts } = require("hardhat")

async function mintgc() {
    //const tokenValue1 = 10 * 10 ** 18
    // const numOfTokens = ethers.BigNumber.from(5)
    // const tokenValue1 = ethers.utils.parseUnits(numOfTokens.toString(), 18)

    const tokenValue1 = ethers.utils.parseEther("30")
    console.log("Token Value:", tokenValue1.toString())

    const accounts = await ethers.getSigners()
    // const accountMM = "0xf493e9A7c091C121bBd031Fc031948BCEFC5086F"

    const account0 = accounts[0]
    const account1 = accounts[1]
    const account2 = accounts[2]
    // const {deployer} = await getNamedAccounts()
    // const gcToken = await ethers.getContract("GCPropToken")

    const gcToken0 = await ethers.getContract("GCPropToken", account0)
    const tx0 = await gcToken0.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx0.wait(1)
    console.log("mint0 completed! " + (await gcToken0.balanceOf(account0.address)).toString())
    // console.log("mint1 completed! " + (await gcToken1.balanceOf(accountMM)).toString())

    const gcToken1 = await ethers.getContract("GCPropToken", account1)
    const tx1 = await gcToken1.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx1.wait(1)
    console.log("mint1 completed! " + (await gcToken1.balanceOf(account1.address)).toString())

    const gcToken2 = await ethers.getContract("GCPropToken", account2)
    const tx2 = await gcToken2.buyTokens(tokenValue1, { value: tokenValue1 })
    await tx2.wait(1)
    console.log("mint2 completed! " + (await gcToken2.balanceOf(account2.address)).toString())

    const supply = await gcToken1.getSupplyLimit()
    console.log("Max Supply: " + supply.toString())
    console.log("Total Supply: " + (await gcToken0.totalSupply()).toString())
}

mintgc()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
