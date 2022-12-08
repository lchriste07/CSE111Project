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
 app.get("/ratedmatchlist", (req, res) => {
  let sql = `SELECT * FROM rated_matches limit 200`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.render("ratedmatchlist" , { title: 'index', index: rows})
  });
 });
 
// gets the unrated matchlist
 app.get("/unratedmatchlist", (req, res) => {
  let sql = `SELECT * FROM unrated_matches limit 200`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    return res.render("unratedmatchlist" , { title: 'index', index: rows})
  });
 });



 // Renders the page to take the inputs
 app.get("/account", (req, res) => {
   res.render("account");
 });

 //Once we get the ID it will render the section with 
 app.post("/useraccount", (req, res) => {
  // Query for the account and get the information from the account and fill out a table. 
    const {emailAddress} = req.body;
    var sql="SELECT * FROM account WHERE acc_accountid = ? limit 1";
    db.all(sql, [emailAddress] ,(err, data) =>{
      if (err) throw err;
      
      if(data[0] === undefined){
        alert("Invalid Login Credentials");
      }else{
        return res.render("editInfo", { title: 'index', index: data});
      }
      
    });

});


app.get("/matchhistory", (req, res) => {
  const ID = req.query.ID;
  var sql="SELECT * FROM rated_matches WHERE rm_white_id = ? or rm_black_id = ?";
  db.all(sql, [ID,ID] ,(err, data) =>{
    if (err) throw err;
    
    if(data[0] === undefined){
      alert("Invalid ID Credentials");
    }else{
      return res.render("matchhistory", { title: 'index', index: data});
    }
    
  });

 });


app.get("/inputUser", (req, res) => {
  res.render("input");
});

app.post("/inputUser", (req, res) => {
  const { ID, DOB, emailAddress } = req.body;

  // Construct a SQL query to check whether the email address already exists in the table
  var sql = `SELECT * FROM account WHERE acc_email = ?`;

  // Use the db.get method to run the query and retrieve the data from the table
  db.get(sql, [emailAddress], function (err, data) {
    if (err) {
      // If an error occurs, log it and send an error response to the client
      console.error(err);
      res.send({ error: "An error occurred while accessing the database" });
      return;
    }

    if (data) {
      // If the email address already exists in the table, send an error response to the client
     alert("This email already exists in this table");
    } else {
      // Otherwise, insert a new row into the account table
      db.run(
        `INSERT INTO account VALUES(?,?,?,?,?)`,
        [ID, DOB, emailAddress, 0, 0],
        function (err) {
          if (err) {
            // If an error occurs, log it and send an error response to the client
            console.error(err);
            alert("An error occurred while adding the account");
            return;
          }

          // Send a success response to the client
          res.redirect("/");
        }
      );
    }
  });
});


app.get("/inputGame", (req, res) => {
  res.render("inputmatches");
});

app.post("/inputGame", (req, res) => {
  const { ID, DOB, emailAddress } = req.body;
  console.log(ID);
  console.log(DOB);
  // Construct a SQL query to check whether the email address already exists in the table
  var sql = `SELECT * FROM account WHERE acc_email = ?`;

  // Use the db.get method to run the query and retrieve the data from the table
  db.get(sql, [emailAddress], function (err, data) {
    if (err) {
      // If an error occurs, log it and send an error response to the client
      console.error(err);
      res.send({ error: "An error occurred while accessing the database" });
      return;
    }

    if (data) {
      // If the email address already exists in the table, send an error response to the client
      res.send({ error: "This email already exists in this table" });
    } else {
      // Otherwise, insert a new row into the account table
      db.run(
        `INSERT INTO account VALUES(?,?,?,?,?)`,
        [ID, DOB, emailAddress, 0, 0],
        function (err) {
          if (err) {
            // If an error occurs, log it and send an error response to the client
            console.error(err);
            res.send({ error: "An error occurred while adding the account" });
            return;
          }

          // Send a success response to the client
          res.redirect("/");
        }
      );
    }
  });
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