const express = require("express");
const path = require("path");
const adminRouter = require("./routes/adminRouter");
const { connection } = require("./config/db");
var cookieParser = require('cookie-parser')
const port = 8070;
const app = express();


app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

app.use("/", adminRouter);

app.listen(port, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  connection();
  console.log(`server is running ${port}`);
});
