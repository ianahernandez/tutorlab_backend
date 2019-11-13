// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Course, Section, Lesson, ExternalResource} = require('../models/course'); 

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

  let id = req.params.course_id;

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
  saveCourse,
  getCourseById,
  saveSection,
  saveLesson,
  saveExternalResource
}
