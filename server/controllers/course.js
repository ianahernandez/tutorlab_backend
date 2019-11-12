// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Course, Section} = require('../models/course'); 

// =====================
// Obtener por Id
// =====================

let getCourseById = (req, res) =>{
  let id = req.params.id;
  Course.findById(id)
  .populate('category','name img')
  .exec((err, courseDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!courseDB) {
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.status(201).json({
          ok: true,
          courseDB
      });
  });
}

// ==========================================================
// Crear nuevo curso
// ==========================================================

let saveCourse = (req, res) =>{

  let body = req.body;

  let course = new Course({
    title: body.title,
    category: body.category_id,
    to_learn: body.to_learn.split(','),
    requirements: body.requirements.split(','),
    target_group: body.target_group.split(','),
  });

  course.save( (err, courseDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      course: courseDB
    });

  });
}

let saveSection = (req,res) =>{

  let id = req.params.id;

  Course.findById(id, (err, courseDB) => {

    let body = req.body;

    let section = new Section({
      title: body.title,
      description: body.description,
    });
   
    section.save( (err, sectionDB) => {

      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      courseDB.sections.push(sectionDB);

      courseDB.save( (err, coursebd) => {

        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }
    
        res.json({
          ok: true,
          course: coursebd
        });
  
      });

    });

  });
  
}

module.exports = {
  saveCourse,
  getCourseById,
  saveSection
}
