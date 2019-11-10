


const express = require('express');

const fileUpload = require('express-fileupload');

const api = express.Router();

//Opciones por defecto

api.use(fileUpload());

api.put('/upload/:type/:id', function (req, res) {

  let type = req.params.type; 

  let id = req.params.type; 



  if ( !req.files ){
    return res.status(400).json({
      ok: false,
      err:{
        message: "No hay archivo seleccionado"
      }
    });
  }

  let fileUploaded = req.files.file; // El input de tener el name file

  let validType = ['user', 'category'];


  if( validType.indexOf(type) < 0 ){
    return res.status(400).json({
      ok: false,
      err:{
        message: 'Carga de '+type+ ' no permitida.',
        type: type
      }
    });
  } 

  
  let validExtention = ['jpg','jpeg','png','mp4','pdf'];

  let nameTokenFile = fileUploaded.name.split('.');

  //let nameFile = nameTokenFile[nameTokenFile.lenght -1];

  let extention = nameTokenFile[nameTokenFile.length -1];

  if( validExtention.indexOf(extention) < 0 ){
    return res.status(400).json({
      ok: false,
      err:{
        message: 'Las extensiones válidas son: ' + validExtention.join(', '),
        ext: extention
      }
    });
  } 
  
  fileUploaded.mv('./uploads/filename.mp4', (err) => {
    if ( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      message: "Imagen subida correctamente"
    })
  });
   

});

module.exports = api;