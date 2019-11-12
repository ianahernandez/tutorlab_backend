// ====================================================
//      Rutas API: Obtener imaganes
//      By TutorLab Team ©
// ====================================================


const express = require('express');

const api = express.Router();

const path = require('path');

const fs = require('fs');

let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');

api.get('/images/:type/:img', (req,res) => {

  let type = req.params.type;

  let img = req.params.img;

  let pathImg = path.resolve(__dirname,`../../uploads/${ type }/${ img }`);

  if( fs.existsSync(pathImg) ){
    res.sendFile(pathImg);
  }
  else{
    res.sendFile(noImagePath);
  }

});

module.exports = api;