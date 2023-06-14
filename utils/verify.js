const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract at address: ", contractAddress)
    try {
        await run("verify:verify", {
            contract: "contracts/governance_standard/Timelock.sol:Timelock",
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.log(error)
        }
    }
}

module.exports = {
    verify,
}
