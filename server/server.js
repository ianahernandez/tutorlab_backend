require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use( require('./routes/user') );
 
// parse application/json
app.use(bodyParser.json());
 
app.get('/', function (req, res) {
  res.json('Hello World')
});

mongoose.connect('mongodb://172.17.0.2:27017/tutorlab', (err, res) => {

  if(err) throw err;

  console.log("Base de datos online");

}); 


app.listen(process.env.PORT, () => {
  console.log('Escuchando el puerto: ', process.env.PORT);
})