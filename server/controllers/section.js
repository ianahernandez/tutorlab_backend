// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Section, Lesson, Course} = require('../models/course'); 

// =====================
// Obtener seccion por Id
// =====================

let getSectionById = (req, res) =>{
  let id = req.params.id;
  Section.findById(id)
  .exec( async (err, sectionDB) => {
    
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!sectionDB) {
          return res.status(400).json({
              ok: false,
              err
          });
      }
      let ids = [];
      sectionDB.lessons.forEach(element => ids.push(element._id));
      await Lesson.find({
        _id: { $in: ids }}, (err, lessons) => {
          sectionDB.lessons = lessons;
        });
  
      console.log(sectionDB);
      res.status(201).json({
          ok: true,
          section: sectionDB
      });
  });
}

// ========================
// Crear nueva seccion
// ========================

let saveSection = (req,res) =>{

  let id = req.params.course_id;

  Course.findOne({_id: id, instructor: req.user._id}, (err, courseDB) => {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!courseDB){
      return res.status(400).json({
        ok: false,
        err:{
          message: "El curso no existe."
        }
      });
    }

    let body = req.body;

    let section = new Section({
      title: body.title,
      description: body.description,
    });
   
    section.save( (err, sectionDB) => {

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      courseDB.sections.push(sectionDB);

      courseDB.save( (err, coursebd) => {

        if(err){
          return res.status(500).json({
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

// ========================
//  Eliminar seccion
// ========================

let deleteSection = (req, res) => {

  let course_id = req.params.course_id;

  let section_id = req.params.section_id;

  Course.findOne({_id: course_id, instructor: req.user._id}, (err, courseDB) => {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!courseDB){
      return res.status(400).json({
        ok: false,
        err:{
          message: "El curso no existe."
        }
      });
    }
   
    Section.findOneAndDelete( {_id: section_id, __v:0 }, (err, sectionDB) => {

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if(!sectionDB){
        return res.status(400).json({
          ok: false,
          err:{
            message: "La sección no existe, o tiene registros asociados (lecciones)"
          }
        });
      }

      courseDB.sections.pull(sectionDB);

      courseDB.save( (err, coursebd) => {

        if(err){
          return res.status(500).json({
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
  saveSection,
  deleteSection,
  getSectionById,
}
