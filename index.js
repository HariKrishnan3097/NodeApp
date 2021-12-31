const express = require("express");
const bp = require("body-parser");
const app = express();
const path = require("path");
let mysql = require("mysql2");
const { body, validationResult } = require("express-validator");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Youknowme@123",
  database: "student",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/admin", function (req, res) {
  res.render("AdminLogin");
});

app.get("/StudentLogin", function (req, res) {
  res.render("StudentLogin");
});

app.get("/StudentRegistration", function (req, res) {
  res.render("home");
});

app.post("/Register", function (req, res) {
  var userName = req.body.Name;
  var Password = req.body.Password;
  var Department = req.body.Department;
  var ConfirmPassword = req.body.ConfirmPassword;
  var Email = req.body.Email;
  var gender = req.body.gender;
  var Mobile = req.body.Mobile;
  var DOB = req.body.DOB;

  var sql = `INSERT INTO student_registration (Name, Password,Department,DOB,ConfirmPassword,Email,Gender,MobileNumber)VALUES ("${userName}", "${Password}","${Department}", "${DOB}", "${ConfirmPassword}", "${Email}", "${gender}", "${Mobile}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    res.render("regsuccess", { Id: result.insertId });
  });
});

app.post("/login", function (req, res) {
  var id = req.body.RegID;
  console.log(id);
  var Password = req.body.Password;
  var sql = `SELECT * FROM student_registration where ID= ${id}`;
  var sql2 = `SELECT * FROM students_marks where ID= ${id}`;
  connection.query(sql, function (err, data) {
    if (err) throw err;
    var Res = JSON.stringify(data);
    var json = JSON.parse(Res);
    if (json[0].Password == Password) {
      connection.query(sql2, function (err, data1) {
        if (err) throw err;
        var Res = JSON.stringify(data1);
        var json1 = JSON.parse(Res);
        console.log(json1);

        res.render("Result", {
          Name: json[0].Name,
          DOB: json[0].DOB,
          Department: json[0].Department,
          Maths: json1[0].Maths,
          CS: json1[0].CS,
          SignalsandSystems: json1[0].SignalsandSystems,
          DSP: json1[0].DSP,
          Physics: json1[0].Physics,
          EngineeringGraphics: json1[0].EngineeringGraphics,
        });
      });
      console.log(json);
    } else {
      res.render("StudentLogin");
      console.log("Password is wrong");
    }
  });
});

app.post("/Adminlogin", function (req, res) {
  var un = req.body.Name;
  console.log(un);
  var Password = req.body.Password;
  var sql = `SELECT Password FROM student_registration where Name= '${un}'`;
  connection.query(sql, function (err, data) {
    if (err) throw err;
    var Res = JSON.stringify(data);
    var json = JSON.parse(Res);
    if (json[0].Password == Password) {
      res.render("AdminPage");
    } else {
      res.render("AdminLogin", { message: "Password is wrong" });
      console.log("Password is wrong");
    }
  });
});

app.post("/Upload", function (req, res) {
  var EngineeringGraphics = req.body.EngineeringGraphics;
  var SignalsandSystems = req.body.SignalsandSystems;
  var Maths = req.body.Maths;
  var CS = req.body.CS;
  var DSP = req.body.DSP;
  var Physics = req.body.Physics;
  var RegNumber = req.body.RegNumber;

  var sql = `INSERT INTO students_marks (EngineeringGraphics, SignalsandSystems,Maths,CS,DSP,Physics,ID)VALUES ("${EngineeringGraphics}", "${SignalsandSystems}","${Maths}", "${CS}", "${DSP}", "${Physics}", "${RegNumber}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    res.render("UploadSuccess", { Id: result.insertId });
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
