// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Section, Lesson} = require('../models/course'); 

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

// ==========================================================
// Crear nueva seccion
// ==========================================================

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

module.exports = {
  saveSection,
  getSectionById,
}
