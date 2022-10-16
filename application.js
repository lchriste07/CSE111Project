const express = require("express");
const app = express();
const port = 3000;


// In order to access the server go to " http://127.0.0.1:3000/ "


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server Started...");
}); 