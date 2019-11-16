// ====================================================
//      Controlador: Instructor
//      By TutorLab Team ©
// ====================================================

const _ = require('underscore');

const Instructor = require('../models/instructor');

const {Course} = require('../models/course'); 

// =====================
// Guardar Instructor
// =====================

let saveInstructor = (user, res) => {

  let nameTokens = user.name.split(' ');
  let name = nameTokens[0];
  let lastname = "";
  if(nameTokens.length > 1){ 
    lastname = nameTokens.slice().splice(1, nameTokens.length-1).join(' ');
  }

  let instructor = new Instructor({
    name: name,
    lastname: lastname,
    gender:'',
    dateBorn: '',
    city: '',
    emailPublic: '',
    title: '',
    description: '',
    social: {
      facebook:'',
      twitter: '',
      linkedin: '',
      github: '',
    },
    ranking: 0,
    user: user._id 
  });

  instructor.save( (err, instructorDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    instructor = instructorDB;

  });

  return instructor;
}

// =====================
// Obtener por UserId
// =====================

let getInstructorByUserId = async (user_id) => {

  let instructor;

  await Instructor.findOne({'user': user_id}, (err, instructorDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    instructor = instructorDB;
  });

  return new Promise(resolve => {
    resolve(instructor);
  });

} 

// =====================
// Actualizar Perfil
// =====================

let  updateProfile = async (id, req, res) => {

  let instructor= {};

  let body = _.pick( req.body,
            ['name', 'lastname', 'gender', 'dateBorn', 'city', 'emailPublic', 'title', 'description', 'interests', 'social' ]);


  await Instructor.findOneAndUpdate({ 'user': id}, body, {new: true, runValidators: true,  context: 'query'}, (err, instructortDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    instructor = instructortDB;
  });

  return new Promise(resolve => {
    resolve(instructor);
  });
}

// // =======================================
// // Obtener todos los cursos de un instructor
// // =======================================

// let getInstructorCourses = (req, res) => {

//   if(req.user.role == "INSTRUCTOR_ROLE"){
//       Course.find({instructor: req.user._id})
//       .select('title price img to_learn update_at created_at status published ranking')
//       .populate('category','name img')
//       .exec((err, coursesDB) => {

//         if(err){
//           res.status(500).json({
//             err
//           })
//         }
//         res.json({
//           ok: true,
//           courses: coursesDB
//         })
//       });
//   }
  
// }

// // =======================================
// // Enviar curso a revisión
// // =======================================

// let sendCourseToReview = (req, res) => {
//   let id = req.params.id;
//   Course.findById(id, async(err, courseDB) => {
//       if (err) {
//           return res.status(500).json({
//               ok: false,
//               err
//           });
//       }
//       if (!courseDB) {
//           return res.status(400).json({
//               ok: false,
//               err: {
//                 message: "El curso no existe."
//               }
//           });
//       }
//       console.log(courseDB.instructor)
//       console.log(req.user._id)
//       if( courseDB.instructor != req.user._id){
//         return res.status(403).json({
//           ok: false,
//           err: {
//             message: "No tiene permisos para ejecutar esta operación."
//           }
//         });
//       }

//       courseDB.status = "IN_REVIEW";
//       courseDB.save( (err, coursebd) =>{
//         if (err) {
//           return res.status(500).json({
//               ok: false,
//               err
//           });
//       }

//       res.status(201).json({
//           ok: true,
//           course: coursebd,
//           message: "El curso se ha enviado a revisión."
//       });

//       });
      
//   });
// }

// // =======================================
// // Publicar o despublicar curso
// // =======================================

// let publishOrHideCourse = (req, res) => {

//   let id = req. params.id;
//   let opt = req.query.opt || 0;
//   if(['1','2',1,2].indexOf(opt) < 0 ){
//     return res.status(400).json({
//       ok: false,
//       err: {
//         message: "Opción inválida.",
//         opt
//       }
//     });
//   }

//   let is_published = true;


//   if(opt == '2' || opt == 2){
//       is_published = false;
//   }

//   Course.findById(id, async(err, courseDB) => {
//       if (err) {
//           return res.status(500).json({
//               ok: false,
//               err
//           });
//       }
//       if (!courseDB) {
//           return res.status(400).json({
//               ok: false,
//               err: {
//                 message: "El curso no existe."
//               }
//           });
//       }

//       if( courseDB.instructor != req.user._id){
//         return res.status(403).json({
//           ok: false,
//           err: {
//             message: "No tiene permisos para ejecutar esta operación."
//           }
//         });
//       }

//       if( !courseDB.active ){
//         return res.status(400).json({
//           ok: false,
//           err: {
//             message: "No permitido: el curso se encuentra pendiente de aprobación, rechazado o en borrador."
//           }
//         });
//       }

//       courseDB.published = is_published;
//       courseDB.save( (err, coursebd) =>{
//         if (err) {
//           return res.status(500).json({
//               ok: false,
//               err
//           });
//       }

//       res.status(201).json({
//           ok: true,
//           course: coursebd,
//       });

//       });
      
//   });
// }

module.exports = { 
  saveInstructor,
  updateProfile,
  getInstructorByUserId,

}