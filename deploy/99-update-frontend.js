const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const gcPropToken = await ethers.getContract("GCPropTokenTestDao")
    fs.writeFileSync(frontEndAbiFile, gcPropToken.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const gcPropToken = await ethers.getContract("GCPropTokenTestDao")
    console.log("gcPropToken:: " + gcPropToken.address)
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    console.log("contractAddresses:: " + JSON.stringify(contractAddresses))
    if (network.config.chainId.toString() in contractAddresses) {
        if (!contractAddresses[network.config.chainId.toString()].includes(gcPropToken.address)) {
            contractAddresses[network.config.chainId.toString()].push(gcPropToken.address)
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [gcPropToken.address]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
