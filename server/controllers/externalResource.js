// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Lesson, ExternalResource} = require('../models/course'); 

// =====================
// Obtener  por Id
// =====================



// ==========================================================
// Crear nuevo curso
// ==========================================================


let saveExternalResource = (req, res)=>{

  let id = req.params.lesson_id;

  Lesson.findById(id, (err, lessonDB) => {

    let body = req.body;

    let resource = new ExternalResource({
      name: body.name,
      url: body.url
    });
   
    resource.save( (err, resourceDB) => {

      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      console.log(resourceDB);

      lessonDB.external_resources.push(resourceDB);

      lessonDB.save( (err, lessonbd) => {

        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }
    
        res.json({
          ok: true,
          lesson: lessonbd
        });
  
      });

    });

  });
}


module.exports = {
  saveExternalResource,
}
