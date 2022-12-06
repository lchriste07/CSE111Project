var app = express();
const sqlite3 = require('sqlite3').verbose();
// const fs = require('fs');

// open the database connection
var db = new sqlite3.Database('./src/games.sqlite');
let sql = `SELECT * FROM rated_matches WHERE rm_turns = 16`;

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, './public/form.html'));
    
// });

app.get("/", (req, res) => { 
    res.render("index", { title: "Home" });
 });


// View
app.post('/view', function (req, res) {
    db.serialize(() => {
        db.all(`SELECT * FROM rated_matches WHERE rm_turns = 16`, [req.body.id], function (err, row) {     //db.each() is only one which is funtioning while reading data from the DB
            if (err) {
                res.send("Error encountered while displaying");
                return console.error(err.message);
            }
            res.send(` Match_ID: ${row.rm_match_id}`);
            console.log("Entry displayed successfully");
        });
    });
});

app.get('/close', function (req, res) {
    db.close((err) => {
        if (err) {
            res.send('There is some error in closing the database');
            return console.error(err.message);
        }
        console.log('Closing the database connection.');
        res.send('Database connection successfully closed');
    });
});

// var data = fs.createWriteStream('data.txt', {
//     flags: 'a'
// })
// function writeRows()
// {
//     db.all(sql, [], (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         rows.forEach((row) => {
//             data.write(row.rm_match_id + "," + row.rm_opening + "," + row.rm_white_id + ',' + row.rm_black_id + "\n");
//         });
//     });
// }

// db.close();