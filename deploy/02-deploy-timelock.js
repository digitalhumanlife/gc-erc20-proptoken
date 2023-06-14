const { ethers, network } = require("hardhat")
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const delay = MIN_DELAY
    const admin = deployer
    const args = [delay, [], [], admin]
    log("----------------------------------------------------")
    const timelock = await deploy("Timelock", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deployed Timelock at: ", timelock.address)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(timelock.address, args)
    }
}

module.exports.tags = ["all", "timelock"]
