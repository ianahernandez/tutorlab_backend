// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Section, Lesson, Course} = require('../models/course'); 

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
  let course_id = req.params.course_id;

  Section.findById(section_id, (err, sectionDB) => {

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

      Course.findOne({_id:course_id})
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

  let section_id = req.params.section_id;
  let course_id = req.params.course_id;
  let lesson_id = req.params.lesson_id

  let body = req.body;

  console.log("course", course_id)
  console.log("section", section_id)
  console.log("lesson", lesson_id)
  console.log("nuevo nombre", body.name)

  Lesson.findByIdAndUpdate(lesson_id, body, {new: true, runValidators: true,  context: 'query'}, (err, lessonDB) =>{
    
    Section.findOne({_id:section_id})
    .update({'lessons._id': lesson_id},
    {'$set': {'lessons.$': lessonDB}})
    .exec((err,result) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      Section.findById(section_id, (err, sectionDB) => {
        if(err){
          return res.status(500).json({
            ok: false,
            err
          });
        }
    
        Course.findOne({_id:course_id})
        .update({'sections._id': section_id},
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
            section: sectionDB
          });
    
        });
      });



    });
  });

  

  


  // Section.findById(section_id, (err, sectionDB) => {

  //   let body = req.body;

  //   let lesson = new Lesson({
  //     name: body.name,
  //   });
   
  //   lesson.save( (err, lessonDB) => {

  //     if(err){
  //       return res.status(400).json({
  //         ok: false,
  //         err
  //       });
  //     }

  //     sectionDB.lessons.push(lessonDB);

  //     sectionDB.save( (err, sectionbd) => {

  //       if(err){
  //         return res.status(400).json({
  //           ok: false,
  //           err
  //         });
  //       }

  //     Course.findOne({_id:course_id})
  //       .update({'sections._id': section_id},
  //       {'$set': {'sections.$': sectionbd}})
  //       .exec((err,result) => {
  //         if(err){
  //           return res.status(500).json({
  //             ok: false,
  //             err
  //           });
  //         }
  //         return res.json({
  //           ok: true,
  //           lesson: lessonDB
  //         });

  //       });

  //     });

  //   });

  // });
  
}


module.exports = {
  saveLesson,
  getLessonById,
  updateLesson
}
