// ====================================================
//      Servidor: main js
//      By TutorLab Team ©
// ====================================================

require('./config/config');

const express = require('express');

const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({origin: process.env.CLIENT_CORS_URL}));

app.options('*', cors({origin: process.env.CLIENT_CORS_URL}));

app.use(bodyParser.json());


//Configuracion de rutas
app.use( require('./routes/index') );
 
// parse application/json
app.use(bodyParser.json());


//Habilitar carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));
 

mongoose.connect(process.env.URLDB, 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err, res) => {

  if(err) throw err;

  console.log("Base de datos online");

}); 


app.listen(process.env.PORT, () => {
  console.log('Escuchando el puerto: ', process.env.PORT);
})