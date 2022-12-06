// index.js

/**
 * Required External Modules
 */

 const express = require("express");
 const path = require("path");


 
 /**
 * App Variables
 */
const app = express();
const port = "8000";

/**
 *  App Configurationconst db = require("sqlite3");

 */

 app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "hbs");
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
 
 
 app.get("/", (req, res) => {
   res.render("index");
 });
 
 app.post("/", (req, res) => {
  
     let sql = `SELECT * FROM account`;
     db.all(sql, [], (err, rows) => {
       if (err) {
         throw err;
       }
       rows.forEach((row) => {
         console.log(row);
       });
     });
   
     const { emailAddress } = req.body;
         return res.render("index" , {
           emailAddress : emailAddress
         })
    
 
 
 });
 
 app.get("/register", (req, res) => {
   res.render("register");
 });
 
 app.get("/login", (req, res) => {
   res.render("login");
 });
 
 app.get("/editInfo", (req, res) => {
   res.render("editInfo");
 });
 
 app.get("/recovery", (req, res) => {
   res.render("recovery");
 });
 
 app.get("/recoveryInput", (req, res) => {
   res.render("recoveryInput");
 });
 
 
 // Import
const url = require("url");


/**
 * Server Activation
 */

 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });