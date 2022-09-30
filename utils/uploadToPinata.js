const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagePath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagePath)

    let responses = []
    console.log("uploading to pintata")
    for (fileIndex in files) {
        console.log("file", fileIndex)
        const readableStreamForFile = fs.createReadStream(`${fullImagePath}/${files[fileIndex]}`)
        try {
            const reponse = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(reponse)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const reponse = await pinata.pinJSONToIPFS(metadata)
        return reponse
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
