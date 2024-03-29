const { ethers, getNamedAccounts } = require("hardhat")
const GCPropTokenABI = require("../artifacts/contracts/GCPropToken.sol/GCPropToken.json").abi

async function eventTest() {
    const { deployer } = await getNamedAccounts()
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const gcTokenContract = await ethers.getContractAt(GCPropTokenABI, contractAddress)
    const contractAccount = gcTokenContract.address
    const deployerAccount = deployer.address
    gcTokenContract.on("UpdatedDiv", (deployerAccount1, amount) => {
        console.log("UpdatedDiv event: " + deployerAccount1 + " / " + amount)
    })
    // await new Promise(async (resolve, reject) => {
    //     setTimeout(() => reject("Timeout!"), 10000)

    //     const test = gcTokenContract.on("UpdatedDiv", (accountEvent, amount) => {
    //         console.log("UpdatedDiv event: " + accountEvent + " / " + amount)
    //         resolve()
    //     })
    // })

    console.log("Testing...")
    console.log("Static Call: " + (await gcTokenContract.callStatic.getDivBalanceOf(deployer)))
}

eventTest()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

//     const [eventLogs, setEventLogs] = useState([])
//     const listenToEvent = () =>{
//     contract.on("Transfer", (from, to, tokenId, event) => {
//         let data = {
//             from,
//             to,
//             tokenId: tokenId.toString(),
//             event,
//         }
//         setEventLogs((oldState) => [...oldState, data])
//     })
// }
//     return(
//     <button
//         style={{display: btnHide?"none":null}}
//         className ="button"
//         onClick={() => listenToEvent()}>Listen to event
//     </button>
//     {
//         eventLogs.reverse().map((event, index) => {
//             return <div key = {index} className="container">
//             <p>from: {event.from}</p>
//             <p>{"======>"}</p>
//             <p>To: {event.to}</p>
//             </div>
//         })
//     }
//     )
