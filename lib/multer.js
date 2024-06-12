const multer = require("multer")
const crypto = require("node:crypto")

const fileTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf"
}

// configure middleware function to parse multipart/form-data
const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/submissions`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString("hex")
      const extension = fileTypes[file.mimetype]
      callback(null, `${filename}.${extension}`)
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype]) // if file type not supported, return req.file as undefined
  }
})

module.exports = upload