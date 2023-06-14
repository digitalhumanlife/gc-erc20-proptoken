const { ethers } = require("hardhat")
const { ADDRESS_ZERO } = require("../helper-hardhat-config")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await ethers.getContract("GCPropTokenTestDao", deployer)
    const timelock = await ethers.getContract("Timelock", deployer)
    const governorContract = await ethers.getContract("GovernorContract", deployer)

    log("----------------------------------------------------")
    log("Setting up roles... ")

    const proposerRole = await timelock.PROPOSER_ROLE()
    const executorRole = await timelock.EXECUTOR_ROLE()
    const adminRole = await timelock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timelock.grantRole(proposerRole, governorContract.address)
    await proposerTx.wait(1)
    const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    // const adminRevokeTx = await timelock.revokeRole(adminRole, deployer)
    // await adminRevokeTx.wait(1)
}

module.exports.tags = ["all", "setup"]
