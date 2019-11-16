// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Lesson, ExternalResource} = require('../models/course'); 

// =====================
// Obtener leccion (clase) por Id
// =====================

let getLessonById = (req, res) =>{

  let id = req.params.id;
  Lesson.findById(id)
  .exec( async (err, lessonDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!lessonDB) {
          return res.status(400).json({
              ok: false,
              err
          });
      }

      res.status(201).json({
          ok: true,
          lesson: lessonDB
      });
  });
}

// ==========================================================
// Crear nueva leccion (clase)
// ==========================================================

let saveLesson = (req, res) => {

  let id = req.params.section_id;

  Section.findById(id, (err, sectionDB) => {

    let body = req.body;

    let lesson = new Lesson({
      name: body.name,
    });
   
    lesson.save( (err, lessonDB) => {

      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      sectionDB.lessons.push(lessonDB);

      sectionDB.save( (err, sectionbd) => {

        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }
    
        res.json({
          ok: true,
          section: sectionbd
        });
  
      });

    });

  });
  
}

module.exports = {
  saveLesson,
  getLessonById
}
