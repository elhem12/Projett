const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'news'
});

connection.connect();

var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.get('/', (req, res) => {
  const query = 'SELECT titre, description, DATE_FORMAT(date, "%Y/%m/%d %H:%i") as date FROM actualites ORDER BY date DESC';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des actualités :', err);
      res.status(500).send('Erreur du serveur');
    } else {
      console.log(results);
      res.render('index', { actualites: results });
    }
  });
});



app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views/add.html"));
});

app.get("/addnews", function (req, res) {
  var untitre = req.query.letitre;
  var unedesc = req.query.ladescription;
  var sql = "insert into actualites(titre, description) values(?, ?)"

  connection.query(sql, [untitre, unedesc], function (error, results, fields) {
    res.redirect('/');
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

