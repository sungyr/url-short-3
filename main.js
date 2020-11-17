const makeid = require("./short-id");
const express = require("express");
const app = new express();
const ejs = require("ejs");
const dotenv = require("dotenv");
const path = require("path");

// var con = require("./models/dataBase");
// var urlShortObj = require("./models/dataBase");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
  ),
});

const mysql = require("mysql");

var con = mysql.createConnection({
  host: `${process.env.host}`,
  user: `${process.env.username}`,
  password: `${process.env.password}`,
  database: `${process.env.database}`,
});

app.get("/", async (req, res) => {
  await con.query(
    "SELECT * FROM shortenedurls ORDER BY id DESC LIMIT 1",
    function (err, result) {
      if (result === undefined) {
        var urlShortObjs = { longurl: null, shorturl: null };
        res.render("index", { urlShortObjs: urlShortObjs });
      } else {
        var convertedUrl = result[0].shorturl;
        var originalUrl = result[0].longurl;
        var urlShortObjs = [{ longurl: originalUrl, shorturl: convertedUrl }];
        res.render("index", { urlShortObjs: urlShortObjs });
      }
    }
  );
});

app.post("/urlShort", async (req, res) => {
  var urlShortObj = {
    longurl: req.body.fullUrl,
    shorturl: makeid(10),
  };
  if (urlShortObj === undefined) {
    var sql = "INSERT INTO shortenedurls SET ? ";
    con.query(sql, urlShortObj, function (err, result) {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    var urlShortObj = {
      longurl: req.body.fullUrl,
      shorturl: makeid(10),
    };
    var sql = "INSERT INTO shortenedurls SET ? ";
    con.query(sql, urlShortObj, function (err, result) {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

app.post("/delete/:shorten", async (req, res) => {
  await con.query(
    "DELETE FROM shortenedurls ORDER BY id DESC LIMIT 1",
    function (err, result) {
      if (err) throw err;
      delete urlShortObj;
      res.redirect("/");
    }
  );
});

app.listen(5000, () => {
  console.log("server running...");
});

//app.listen을 node_env 고려해서 다시쓰기
