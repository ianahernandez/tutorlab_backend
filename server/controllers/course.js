// ====================================================
//      Controlador: Curso
//      By TutorLab Team ©
// ====================================================
const _ = require('underscore');

const {Course, Section} = require('../models/course'); 

// =================================
// Obtener todos los cursos activos
// =================================

let getCourses = (req, res) => {

  // Aqui se mostrara la lista de cursos ACTIVOS

  let statuses = ["APPROVED"]
  let opt_active = [true]

  if(req.user != undefined){
    if(req.user.role == "ADMIN_ROLE"){
      statuses = ["APPROVED", "REFUSED", "IN_REVIEW"];
      opt_active.push(false);
    }
  }

  let filters = {
    status : { $in: statuses },
    active: { $in: opt_active }
  }

  Course.find(filters)
  .select('title price img to_learn update_at created_at ranking status active')
  .populate('category','name img')
  .populate('instructor', 'name')
  .exec((err, coursesDB) => {
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
    language: body.language,
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

// ==========================================================
// Actualizar Curso
// ==========================================================

let updateCourse = (req, res) =>{

  let id = req.params.id;

  let body = _.pick( req.body, 
    ['title', 'subtitle', 'category', 'description', 'price', 'messages',
    'to_learn', 'requirements', 'taget_group']);

    body.update_at = new Date();

  Course.findOneAndUpdate( {_id: id, instructor: req.user._id}, body, {new: true, runValidators: true,  context: 'query'}, (err, courseDB) => {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!courseDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Curso no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      course: courseDB
    });

  });
}

// =======================================
// Obtener todos los cursos de un instructor
// =======================================

let getInstructorCourses = (req, res) => {

  if(req.user.role == "INSTRUCTOR_ROLE"){
      Course.find({instructor: req.user._id, active: true})
      .select('title price img to_learn update_at created_at status published ranking')
      .populate('category','name img')
      .exec((err, coursesDB) => {

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
  
}

// =======================================
// Aprobar o rechazar Curso
// =======================================

let approveOrRefuseCourse = (req, res) =>{

  let id = req. params.id;
  let status = req.query.opt || "IN_REVIEW";

  if(["APPROVED", "REFUSED"].indexOf(status) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: "Estado incorrecto.",
        status
      }
    });
  }

  let cambiarEstado = {
    status: status
  }

  if(status == "APPROVED"){
    cambiarEstado.published = true;
  }

  Course.findByIdAndUpdate( id, cambiarEstado, {new: true, context: 'query'}, (err, courseDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if( !courseDB ){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Curso no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      course: courseDB
    });

  });
}

// =======================================
// Enviar curso a revisión
// =======================================

let sendCourseToReview = (req, res) => {
  let id = req.params.id;
  Course.findById(id, async(err, courseDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!courseDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "El curso no existe."
              }
          });
      }
      if( courseDB.instructor != req.user._id){
        return res.status(403).json({
          ok: false,
          err: {
            message: "No tiene permisos para ejecutar esta operación."
          }
        });
      }

      courseDB.status = "IN_REVIEW";
      courseDB.save( (err, coursebd) =>{
        if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      res.status(201).json({
          ok: true,
          course: coursebd,
          message: "El curso se ha enviado a revisión."
      });

      });
      
  });
}

// =======================================
// Publicar o despublicar curso
// =======================================

let publishOrHideCourse = (req, res) => {

  let id = req. params.id;
  let opt = req.query.opt || 0;
  if(['1','2',1,2].indexOf(opt) < 0 ){
    return res.status(400).json({
      ok: false,
      err: {
        message: "Opción inválida.",
        opt
      }
    });
  }

  let is_published = true;


  if(opt == '2' || opt == 2){
      is_published = false;
  }

  Course.findById(id, async(err, courseDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!courseDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "El curso no existe."
              }
          });
      }

      if( courseDB.instructor != req.user._id){
        return res.status(403).json({
          ok: false,
          err: {
            message: "No tiene permisos para ejecutar esta operación."
          }
        });
      }

      if( courseDB.status != "APPROVED"  ){
        return res.status(400).json({
          ok: false,
          err: {
            message: "No permitido: el curso se encuentra pendiente de aprobación, rechazado o en borrador."
          }
        });
      }

      courseDB.published = is_published;
      courseDB.save( (err, coursebd) =>{
        if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      res.status(201).json({
          ok: true,
          course: coursebd,
      });

      });
      
  });
}

// =======================================
// Eliminación lógica de curso
// =======================================

let deleteCourse = (req, res) => {

  let id = req. params.id;

  Course.findById(id, async(err, courseDB) => {
      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }
      if (!courseDB) {
          return res.status(400).json({
              ok: false,
              err: {
                message: "El curso no existe."
              }
          });
      }

      if( courseDB.instructor != req.user._id){
        return res.status(403).json({
          ok: false,
          err: {
            message: "No tiene permisos para ejecutar esta operación."
          }
        });
      }

      // SI hay estudiantes inscritos NO ELIMINAR

      courseDB.active = false;
      courseDB.save( (err, coursebd) =>{
        if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      res.status(201).json({
          ok: true,
          course: coursebd,
      });

      });
      
  });
}


module.exports = {
  saveCourse,
  getCourseById,
  getCourses,
  approveOrRefuseCourse,
  updateCourse,
  getInstructorCourses,
  sendCourseToReview,
  publishOrHideCourse,
  deleteCourse
}
