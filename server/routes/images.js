// ====================================================
//      Rutas API: Obtener imaganes
//      By TutorLab Team ©
// ====================================================


const express = require('express');

const api = express.Router();

const path = require('path');

const fs = require('fs');

const { verifyImgFormat, verifyVideoFormat } = require('../middlewares/authorization.js');

let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');

let noImageUser = path.resolve(__dirname,'../assets/user.png');

api.get('/images/:type/:img', [verifyImgFormat], (req,res) => {

  let type = req.params.type;

  let img = req.params.img;

  let pathImg = path.resolve(__dirname,`../../uploads/${ type }/${ img }`);

  if( fs.existsSync(pathImg) ){
    res.sendFile(pathImg);
  }
  else{
    if(type == 'users') {
      res.sendFile(noImageUser);
    }
    else{
      res.sendFile(noImagePath);
    }
    
  }

});

api.get('/videos/:type/:src', [verifyVideoFormat], (req,res) => {

  let type = req.params.type;

  let src = req.params.src;

  let pathImg = path.resolve(__dirname,`../../uploads/${ type }/${ src }`);

  if( fs.existsSync(pathImg) ){
    res.sendFile(pathImg);
  }
  else{
    res.sendFile(noImagePath);
  }

});

module.exports = api;