const express = require("express");
const adminModel = require("../models/adminModel");
const fs = require("fs");
const path = require("path");
const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  if (req.cookies.adminStore) {
    return res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});
adminRouter.get("/signup", (req, res) => {
  res.render("signUp");
});
adminRouter.get("/dashboard", (req, res) => {
  if (req.cookies.adminStore) {
    return res.render("dashboard");
  } else {
    return res.redirect("/");
  }
});

adminRouter.post("/createAdmin", adminModel.uploadImage, async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    if (req.file) {
      req.body.image = adminModel.adminUploadPath + "/" + req.file.filename; // /upload/image-123529874
      await adminModel.create(req.body);
      console.log("admin created successfully");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
});

adminRouter.get("/viewAdmin", async (req, res) => {// cookie lagana
  try {
    const adminData = await adminModel.find({});
    res.render("viewAdmin", { adminData: adminData });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

adminRouter.get("/adminDelete/:id", async (req, res) => {
  try {
    const getAdmin = await adminModel.findById(req.params.id);
    // console.log(getAdmin)
    if (getAdmin) {
      const imagePath = getAdmin.image;
      fs.unlinkSync(path.join(__dirname, "..", imagePath));
      await adminModel.findByIdAndDelete(req.params.id);
      console.log("admin deleted successfully");
      return res.redirect("/viewAdmin");
    } else {
      console.log("admin not found");
      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

adminRouter.get("/adminEdit/:id", async (req, res) => {// cookie lagana
  try {
    const getAdmin = await adminModel.findById(req.params.id);
    return res.render("editAdmins", { getAdmin: getAdmin });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
});

adminRouter.post("/updateAdmin", adminModel.uploadImage, async (req, res) => { //update cookie 
  if (req.file) {
    const findData = await adminModel.findById(req.body.id);
    if (findData) {
      const imagePath = findData.image;
      fs.unlinkSync(path.join(__dirname, "..", imagePath));
      req.body.image = adminModel.adminUploadPath + "/" + req.file.filename;
      await adminModel.findByIdAndUpdate(req.body.id, req.body);
      console.log("updated successfully");
      res.redirect("/viewAdmin");
    } else {
      console.log("admin not found");
      return res.redirect("/");
    }
  }
});

adminRouter.post("/checkLogin", async (req, res) => {
  try {
    const adminData = await adminModel.findOne({ email: req.body.email });
    if (adminData) {
      if (adminData.password == req.body.password) {
        res.cookie("adminStore", adminData);
        res.redirect("/dashboard");
      } else {
        console.log("Invalid password");
        return res.redirect("/");
      }
    } else {
      console.log("Invalid email or password");
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

module.exports = adminRouter;

// let object = {}

// object.name = "prabh";
// console.log(object);
