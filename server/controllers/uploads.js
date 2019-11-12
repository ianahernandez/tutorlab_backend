// ====================================================
//      Controlador: Carga de archivos
//      By TutorLab Team ©
// ====================================================

const validType = ['users', 'categories'];

const validExtention = ['jpg','jpeg','png','mp4','pdf'];

const User = require('../models/user');

const Category = require('../models/category');

const fs = require('fs');

const path = require('path');


let uploadFile = (req, res) =>{

  let type = req.params.type; 

  let id = req.params.id; 

  if ( !req.files ){
    return res.status(400).json({
      ok: false,
      err:{
        message: "No hay archivo seleccionado"
      }
    });
  }

  let fileUploaded = req.files.file; // El input de tener el name file

  if( validType.indexOf(type) < 0 ){
    return res.status(400).json({
      ok: false,
      err:{
        message: 'Carga de '+type+ ' no permitida.',
        type: type
      }
    });
  } 

  let nameTokenFile = fileUploaded.name.split('.');

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

  let filename = `${id}-${ new Date().getMilliseconds() }.${ extention }`
  
  fileUploaded.mv(`uploads/${type}/${filename}`, (err) => {
    if ( err ){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    uploadByType(type, id, res, filename);

  });

}

let uploadByType = (type,id,res,filename) =>{
  switch (type) {
    case 'users':
      userImage(id, res, filename);
      break;
    case 'categories':
      categoryImage(id, res, filename);
      break;
  
    default:
      break;
  }
}

let userImage = (id, res, filename) => {
  User.findById(id, (err, userDB) => {
    if(err){
      deleteFile('users', filename);
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if( ! userDB ){
      deleteFile('users', filename)
      return res.status(400).json({
        ok: false,
        err: "Usuario no existe"
      });
    }

    deleteFile('users', userDB.img);
    
    userDB.img = filename;

    userDB.save((err, userbd) => {
      if(err){
        return console.log(err)
      }
      res.json({
        ok: true,
        usuario: userDB,
      });
    });

  });
}

let categoryImage = (id, res, filename) => {
  Category.findById(id, (err, categoryDB) => {
    if(err){
      deleteFile('categories', filename);
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if( ! categoryDB ){
      deleteFile('categories', filename)
      return res.status(400).json({
        ok: false,
        err: "La categoría no existe"
      });
    }

    deleteFile('categories', categoryDB.img);
    
    categoryDB.img = filename;

    categoryDB.save((err, categorybd) => {
      if(err){
        return console.log(err)
      }
      res.json({
        ok: true,
        category: categoryDB,
      });
    });

  });
}

let deleteFile = (type, filename) => {

  let pathImg = path.resolve(__dirname, `../../uploads/${ type }/${ filename }`);

    if( fs.existsSync(pathImg) ){
      fs.unlinkSync(pathImg);
    }  
}

module.exports = {
  uploadFile
}