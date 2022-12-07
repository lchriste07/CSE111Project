// index.js

/**
 * Required External Modules
 */

 const express = require("express");
 const path = require("path");
const alert = require("alert")

 
 /**
 * App Variables
 */
const app = express();
const port = "8000";

/**
 *  App Configurationconst db = require("sqlite3");

 */

 app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "ejs");
 app.use(express.static(path.join(__dirname, "public")));
 app.use(express.urlencoded({ extended: false }));
 app.use(express.json());

/**
 * Routes Definitions
 */

 const sqlite3 = require('sqlite3').verbose();
 let db = new sqlite3.Database('games.sqlite', sqlite3.OPEN_READWRITE ,(err) => {
  if (err) {
    console.error(err.message);
  }
 
 
  console.log('Connected to database.');
 }); 
 
 
 // Home Page
 app.get("/",function(req, res) {
  res.render('index');
});
 
 // Get list of all matches from the rated section
 app.get("/matchlist", (req, res) => {
  let sql = `SELECT * FROM rated_matches limit 200`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.render("matchlist" , { title: 'index', index: rows})
  });
 });





 
 app.get("/account", (req, res) => {
   res.render("account");
 });

 //Once we get the ID it will render the section with 
 app.post("/account", (req, res) => {
  // Query for the account and get the information from the account and fill out a table. 
    const {emailAddress} = req.body;
    var sql="SELECT * FROM account WHERE acc_accountid = ? limit 1";
    db.all(sql, [emailAddress] ,(err, data) =>{
      if (err) throw err;
      if (err){
        alert("Invalid Login Credentials");
         return res.render("account");
      }
      if(data[0].acc_accountid === emailAddress){
         res.render("editInfo", { title: 'index', index: data});
      }
      
    });


  res.render("editinfo");
});

app.post("/editinfo", (req, res) => {
  // Query for the account and get the information from the account and fill out a table. 



  res.render("index");
  alert("Thank for editing your info!")
});
 

app.get("/openings",function(req, res) {
  var sql='SELECT * FROM opening limit 200';
  db.all(sql, function (err, data) {
  if (err) throw err;
  res.render('opening', { title: 'Opening List', index: data});
});
 });
 

 // Upon landing on the leaderboard tab prints the leaderboards for top 200
 app.get("/leaderboard", (req, res) => {
  var sql='SELECT * FROM leaderboard GROUP BY lb_overall_winrate ORDER BY lb_overall_winrate DESC Limit 200';
  db.all(sql, function (err, data) {
  if (err) throw err;
  res.render('leaderboard', { title: 'Leaderboard Ranking', index: data});
});
 });
 
 
 // Import
const url = require("url");


/**
 * Server Activation
 */

 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });