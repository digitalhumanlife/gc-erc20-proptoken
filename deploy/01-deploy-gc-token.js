const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    SUPPLY_CAP,
    DECIMALS,
    INITIAL_PRICE,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log("SUPPLY_CAP:: " + SUPPLY_CAP.toString())
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const TOTAL_SUPPLY = ethers.utils.parseUnits(SUPPLY_CAP.toString(), 18)
    console.log("SUPPLY_CAP:: " + SUPPLY_CAP.toString())
    console.log("Total supply:: " + TOTAL_SUPPLY.toString())
    console.log("chainId:: " + chainId.toString())

    log("----------------------------------------------------")
    arguments = [INITIAL_PRICE, TOTAL_SUPPLY]
    const gcToken = await deploy("GCPropToken", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deployed GCToken ERC20 Token at: ", gcToken.address)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(gcToken.address, arguments)
    }
}

module.exports.tags = ["all", "gctoken"]
