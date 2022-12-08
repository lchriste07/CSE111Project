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


app.get("/matchhistoryrated", (req, res) => {
  const ID = req.query.ID;
  var sql="SELECT * FROM rated_matches WHERE rm_white_id = ? or rm_black_id = ?";
  db.all(sql, [ID,ID] ,(err, data) =>{
    if (err) throw err;
    
    if(data[0] === undefined){
      alert("No Matches of this Catagory");
    }else{
      return res.render("ratedmatchhistory", { title: 'index', index: data});
    }
    
  });

 });


 app.get("/matchhistoryunrated", (req, res) => {
  const ID = req.query.ID;
  var sql="SELECT * FROM unrated_matches WHERE un_white_id = ? or un_black_id = ?";
  db.all(sql, [ID,ID] ,(err, data) =>{
    if (err) throw err;
    
    if(data[0] === undefined){
      alert("No Matches of this Catagory");
    }else{
      return res.render("unratedmatchhistory", { title: 'index', index: data});
    }
    
  });

 });


 app.post("/choice",function(req, res) {
  const {ID , amount , matchid , choice} = req.body;
  var sql = `SELECT * FROM rated_matches WHERE rm_match_id = ? LIMIT 1`;

  db.get(sql, [matchid], (err, data) => {
    if (err) throw err;

    if (data === undefined) {
      alert("No matches of this category");
      return;
    }

    // Insert a row into the account table for a correct choice
    if (data.rm_match_res === choice) {
      var winnerId = data.rm_match_res === "white" ? data.rm_white_id : data.rm_black_id;
      var loserId = data.rm_match_res === "black" ? data.rm_white_id : data.rm_black_id;
      var sql = `INSERT INTO betting_logs VALUES(?,?,?,?,?,?,?,?,?,?,?)`;

      db.run(sql, [
        ID,
        winnerId,
        loserId,
        data.rm_black_rating,
        data.rm_white_rating,
        "win",
        amount,
        matchid,
        100,
        2022-12-8,
        choice
      ], (err, data) => {
        if (err) throw err;
      });
    }else{
      
      var winnerId = data.rm_match_res === "black" ? data.rm_white_id : data.rm_black_id;
      var loserId = data.rm_match_res === "white" ? data.rm_white_id : data.rm_black_id;
      var sql = `INSERT INTO betting_logs VALUES(?,?,?,?,?,?,?,?,?,?,?)`;

      db.run(sql, [
        ID,
        winnerId,
        loserId,
        data.rm_black_rating,
        data.rm_white_rating,
        "lose",
        amount,
        matchid,
        100,
        2022-12-8,
        choice
      ], (err, data) => {
        if (err) throw err;
      });
    }

    // Update the balance for a correct choice
    if (data.rm_match_res === choice) {
      var sql = `SELECT acc_balance FROM account WHERE acc_accountid = ?`;
      db.get(sql, [ID], (err, balance) => {
        if (err) throw err;
        console.log(balance.acc_balance);
        var sql = `UPDATE account SET acc_balance = ? WHERE acc_accountid = ?`;
        db.run(sql, [balance.acc_balance + (2 * amount), ID], (err, money) => {
          if (err) throw err;
          alert("You won the bet and the funds have been added to your account!");
        });
      });
    }else{
      var sql = `SELECT acc_balance FROM account WHERE acc_accountid = ?`;
      db.get(sql, [ID], (err, balance) => {
        if (err) throw err;
        console.log(balance.acc_balance);
        var sql = `UPDATE account SET acc_balance = ? WHERE acc_accountid = ?`;
        db.run(sql, [ balance.acc_balance - (2 * amount), ID], (err, money) => {
          if (err) throw err;
          alert("Sorr that you lost the bet...Better luck next time!!!");
        });
      });
    }
    return res.redirect("/makebet");
  });
});




app.post("/makebet",function(req, res) {
  const {emailAddress} = req.body;
   var sql="SELECT * FROM rated_matches WHERE rm_white_id != ? AND rm_black_id != ? AND rm_white_rating > 1600 AND rm_black_rating >1600 ORDER BY random() LIMIT 1";
    db.all(sql, [emailAddress , emailAddress] ,(err, data) =>{
      if (err) throw err;
      // Generate a random number for what match is selected
      var temp = data[0].rm_match_id;
      return res.render("betchoice" ,{index: data , ID: emailAddress , matchid : temp});
      
    });


});



 app.get("/makebet",function(req, res) {
  res.render('betpage');
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
  const { ID, opening, whiteid , blackid ,whiterating ,blackrating ,turncount, movelist ,matchres } = req.body;
  
      db.run(
        `INSERT INTO rated_matches VALUES(?,?,?,?,?,?,?,?,?)`,
        [ID, opening, whiteid , blackid ,whiterating ,blackrating ,turncount, movelist ,matchres],
        function (err) {
          if (err) {
            console.error(err);
            if(matchres === "white"){
              var sql="SELECT * FROM leaderboard WHERE lb_player_id = ? ";
              db.all(sql, [whiteid] ,(err, data) =>{
                if (err) throw err;
                var sql = `UPDATE leaderboard SET lb_wins = ? , lb_overall_winrate = ? WHERE lb_player_id = ?`;
                  db.run(sql, [data.lb_wins + 1, (data.lb_wins + 1) / data.lb_losses], (err, money) => {
              if (err) throw err;
            });
              });
              var sql="SELECT * FROM leaderboard WHERE lb_player_id = ? ";
              db.all(sql, [blackid] ,(err, data) =>{
                if (err) throw err;
                var sql = `UPDATE leaderboard SET lb_losses = ? , lb_overall_winrate = ? WHERE lb_player_id = ?`;
                  db.run(sql, [data.lb_losses + 1, data.lb_wins / (data.lb_losses + 1)], (err, money) => {
              if (err) throw err;
              alert("Successfully Added new Data to table. ")
              res.redirect("/");
            });
              });
            }else{
              var sql="SELECT * FROM leaderboard WHERE lb_player_id = ? ";
              db.all(sql, [blackid] ,(err, data) =>{
                if (err) throw err;
                var sql = `UPDATE leaderboard SET lb_wins = ? , lb_overall_winrate = ? WHERE lb_player_id = ?`;
                  db.run(sql, [data.lb_wins + 1, (data.lb_wins + 1) / data.lb_losses], (err, money) => {
              if (err) throw err;
            });
              });
              var sql="SELECT * FROM leaderboard WHERE lb_player_id = ? ";
              db.all(sql, [whiteid] ,(err, data) =>{
                if (err) throw err;
                var sql = `UPDATE leaderboard SET lb_losses = ? , lb_overall_winrate = ? WHERE lb_player_id = ?`;
                  db.run(sql, [data.lb_losses + 1, data.lb_wins / (data.lb_losses + 1)], (err, money) => {
              if (err) throw err;
              alert("Successfully Added new Data to table. ")
              res.redirect("/");
            });
              });
            }
           
          }

        }
      );

    }
  );

 

app.get("/openings",function(req, res) {
  var sql='SELECT * FROM opening limit 200';
  db.all(sql, function (err, data) {
  if (err) throw err;
  res.render('opening', { title: 'Opening List', index: data});
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


 app.get("/q1",function(req, res) {
  var sql='SELECT * FROM leaderboard JOIN account ON lb_player_id = acc_accountid WHERE lb_wins + lb_losses + lb_draws >= 30 AND lb_overall_winrate >= 0.4 AND acc_balance >= 5000 ORDER BY lb_overall_winrate DESC LIMIT 10;';
  db.all(sql, function (err, data) {
  if (err) throw err;
  res.render('generalQuery1', { title: 'Opening List', index: data});
});
 });


 app.get("/q2",function(req, res) {
  var sql = "SELECT op_name, COUNT(*) AS total_matches, AVG(lb_overall_winrate) AS avg_win_rate, AVG(lb_rating) AS avg_rating FROM rated_matches JOIN opening ON rm_opening = op_name JOIN leaderboard ON lb_player_id = rm_white_id OR lb_player_id = rm_black_id GROUP BY op_name limit 100;"
  db.all(sql, function (err, data) {
  if (err) throw err;
  res.render('generalQuery2', { title: 'Opening List', index: data});
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