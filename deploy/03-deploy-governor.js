const { ethers } = require("hardhat")
const {
    developmentChains,
    QUORUM_PERCENTAGE,
    VOTING_PERIOD,
    VOTING_DELAY,
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const governanceToken = await ethers.getContract("GCPropTokenTestDao")
    const timelock = await ethers.getContract("Timelock")
    const args = [
        governanceToken.address,
        timelock.address,
        QUORUM_PERCENTAGE,
        VOTING_PERIOD,
        VOTING_DELAY,
    ]

    log("----------------------------------------------------")
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("Deployed GovernorContract at: ", governorContract.address)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governorContract.address, [])
    }
}

module.exports.tags = ["all", "governor"]
