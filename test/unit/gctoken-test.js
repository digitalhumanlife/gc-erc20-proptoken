const { getNamedAccounts, ethers } = require("hardhat")
const {
    developmentChains,
    SUPPLY_CAP,
    INITIAL_PRICE,
    MINIMUM_QUANTITY,
} = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("GCToken Type1", function () {
          let gcToken
          let deployer

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["gctoken"])
              gcToken = await ethers.getContract("GCPropToken", deployer)
          })

          describe("constructor", function () {
              it("should set the initial value correctly", async function () {
                  const initialPrice = await gcToken.getTokenPrice()
                  const supplyCap = await gcToken.getSupplyLimit()
                  const minimumQuantity = await gcToken.getMinimumQuantity()
                  assert.equal(INITIAL_PRICE, initialPrice.toString())
                  assert.equal(SUPPLY_CAP * 10 ** 18, supplyCap.toString())
                  assert.equal(MINIMUM_QUANTITY, minimumQuantity.toString())
              })
              // const INITIAL_PRICE = "1"
              // const SUPPLY_CAP = "1000"
              // const MINIMUM_QUANTITY = "100"
              // arguments = [INITIAL_PRICE, TOTAL_SUPPLY, MINIMUM_QUANTITY]
          })

          describe("buyTokens", function () {
              it("should buy tokens correctly", async function () {
                  const tokenValue1 = ethers.utils.parseEther("10")
                  const tx0 = await gcToken.buyTokens(tokenValue1, { value: tokenValue1 })
                  await tx0.wait(1)

                  const deployerBalance = await gcToken.balanceOf(deployer)

                  assert.equal(tokenValue1.toString(), deployerBalance.toString())
              })
          })
      })
