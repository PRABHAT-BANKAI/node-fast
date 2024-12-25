const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const imagePath = "/uploads"

const adminSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname,"..",imagePath))
  },
  filename: function (req, file, cb) {
  
    cb(null, file.fieldname + '-' + Date.now())
  }
})

adminSchema.statics.uploadImage = multer({ storage: storage }).single("image")
adminSchema.statics.adminUploadPath = imagePath


const adminModel = mongoose.model("adminData",adminSchema)

module.exports = adminModel;
