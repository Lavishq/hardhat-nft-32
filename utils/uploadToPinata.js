const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

async function storeImage(imagesFilePath) {
    const fullImagePath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagePath)

    console.log(files)
}
module.exports = { storeImage }