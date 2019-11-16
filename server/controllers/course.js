// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Course, Section, Lesson, ExternalResource} = require('../models/course'); 

// =================================
// Obtener todos los cursos activos
// =================================

let getCourses = (req, res) => {

  // Aqui se mostrara la lista de cursos ACTIVOS

    Course.find({status:true}, (err, coursesDB) => {
      if(err){
          res.status(500).json({
            err
          })
        }
        res.json({
          ok: true,
          courses: coursesDB
        })
    });
}

// =====================
// Obtener curso por Id
// =====================

let getCourseById = (req, res) =>{
  let id = req.params.id;
  Course.findById(id)
  .populate('category','name img')
  .populate('instructor', 'name img username')
  .exec( async(err, courseDB) => {
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

      let ids = [];
      courseDB.sections.forEach(element => ids.push(element._id));
      await Section.find({
        _id: { $in: ids }}, (err, sections) => {

          if(!err){
            courseDB.sections = sections;
          }       

        });

      res.status(201).json({
          ok: true,
          course: courseDB
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
    to_learn: body.to_learn,
    requirements: body.requirements,
    target_group: body.target_group,
    instructor: req.user._id
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


module.exports = {
  saveCourse,
  getCourseById,
  getCourses
}
