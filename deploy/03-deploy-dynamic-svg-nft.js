const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    if (!developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    log("_------------------------------")
    const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" })
    const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" })
    const args = [ethUsdPriceFeedAddress, lowSvg, highSvg]

    const dynamicNftSvg = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("--------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verfying...")
        await verify(dynamicNftSvg.address, args)
    }
}
module.exports.tags = ["all", "dynamicSvg", "main", "custom"]
