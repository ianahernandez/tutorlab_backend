// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Section, Lesson, Course} = require('../models/course'); 

const fs = require('fs');

const path = require('path');


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

  let section_id = req.params.section_id;
  //let course_id = req.params.course_id;

  Section.findById(section_id, (err, sectionDB) => {

    let body = req.body;

    let lesson = new Lesson({
      name: body.name,
      section: section_id
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

          Course.findOne({_id:sectionbd.course})
            .update({'sections._id': section_id},
            {'$set': {'sections.$': sectionbd}})
            .exec((err,result) => {
              if(err){
                return res.status(500).json({
                  ok: false,
                  err
                });
              }
              return res.json({
                ok: true,
                lesson: lessonDB
              });

            });

      });

    });

  });
  
}

// ==========================================================
// Actualizar leccion (clase)
// ==========================================================

let updateLesson = (req, res) => {

  // let section_id = req.params.section_id;
  // let course_id = req.params.course_id;
  let lesson_id = req.params.lesson_id

  let body = _.pick( req.body, ['name']);

  updateFieldsLesson(lesson_id,body, res);
}

// ==========================================================
// Eliminar leccion (clase)
// ==========================================================

let deleteLesson = (req, res) => {

  // let section_id = req.params.section_id;
  // let course_id = req.params.course_id;
  let lesson_id = req.params.lesson_id

  Lesson.findByIdAndDelete(lesson_id, (err, lessonDB) =>{
   
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    } 

    Section.findById(lessonDB.section, (err, sectionDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err  
        });
      }

      sectionDB.lessons.pull(lessonDB)
  
      sectionDB.save( (err, sectionbd) => {

        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }

          Course.findOne({_id:sectionbd.course})
            .update({'sections._id': lessonDB.section},
            {'$set': {'sections.$': sectionbd}})
            .exec((err,result) => {
              if(err){
                return res.status(500).json({
                  ok: false,
                  err
                });
              }
              

              let pathImg = path.resolve(__dirname, `../../uploads/lessons/${ lessonDB.video }`);

              if( fs.existsSync(pathImg) ){
                fs.unlinkSync(pathImg);
              } 


              return res.json({
                ok: true,
                section: sectionbd
              });

            });

      });
    });
  });  
}

// ==========================================================
//       SERVICIOS 
// ==========================================================

let updateFieldsLesson = (id, body, res) =>{
  Lesson.findByIdAndUpdate(id, body, {new: true, runValidators: true,  context: 'query'}, (err, lessonDB) =>{
   
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    Section.findOne({_id:lessonDB.section})
    .update({'lessons._id': id},
    {'$set': {'lessons.$': lessonDB}})
    .exec((err,result) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Section.findById(lessonDB.section, (err, sectionDB) => {
        if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }
    
        Course.findOne({_id:sectionDB.course})
        .update({'sections._id': lessonDB.section},
        {'$set': {'sections.$': sectionDB}})
        .exec((err,result) => {
          if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }
          return res.json({
            ok: true,
            lesson: lessonDB
          });
    
        });
      });
    });
  });  
}

module.exports = {
  saveLesson,
  getLessonById,
  updateLesson,
  updateFieldsLesson,
  deleteLesson
}
