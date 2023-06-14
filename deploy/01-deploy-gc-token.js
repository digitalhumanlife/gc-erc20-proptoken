const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    SUPPLY_CAP,
    DECIMALS,
    INITIAL_PRICE,
    MINIMUM_QUANTITY,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const TOTAL_SUPPLY = ethers.utils.parseUnits(SUPPLY_CAP.toString(), 18)
    console.log("SUPPLY_CAP:: " + SUPPLY_CAP.toString())
    console.log("Total supply:: " + TOTAL_SUPPLY.toString())
    console.log("chainId:: " + chainId.toString())

    console.log("inital price:: " + INITIAL_PRICE.toString())
    console.log("minimum quantity:: " + MINIMUM_QUANTITY.toString())

    log("----------------------------------------------------")
    arguments = [INITIAL_PRICE, TOTAL_SUPPLY, MINIMUM_QUANTITY]
    const gcToken = await deploy("GCPropTokenTestDao", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deployed GCToken ERC20Vote Token at: ", gcToken.address)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(gcToken.address, arguments)
    }
}

module.exports.tags = ["all", "gctoken"]
