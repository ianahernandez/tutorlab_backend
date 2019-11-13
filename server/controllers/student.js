// ====================================================
//      Controlador: Estudiante
//      By TutorLab Team ©
// ====================================================

const _ = require('underscore');

const Student = require('../models/student');

// =====================
// Guardar Estudiante
// =====================

let saveStudent = (user, res) => {

  let student = new Student({
    name: user.name.split(' ')[0],
    lastname: user.name.split(' ')[user.name.split(' ').length -1],
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
    user: user._id
  });

  student.save( (err, studentDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    student = studentDB;

  });

  return student;
}

// =====================
// Obtener por UserId
// =====================

let getStudentByUserId = async (user_id) => {

  let student;

  await Student.findOne({'user': user_id}, (err, studentDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    student = studentDB;
  });

  return new Promise(resolve => {
    resolve(student);
  });

}

// =====================
// Actualizar Perfil
// =====================


let  updateProfile = async (id, req, res) => {

  let student= {};

  let body = _.pick( req.body,
            ['name', 'lastname', 'gender', 'dateBorn', 'city', 'emailPublic', 'title', 'description', 'interests'.split(','), 'social.facebook','social.linkedin', 'social.github', 'social.twitter' ]);

  body.interests = req.body.interests.split(',');


  await Student.findOneAndUpdate({ 'user': id}, body, {new: true, runValidators: true,  context: 'query'}, (err, studentDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    student = studentDB;
  });

  return new Promise(resolve => {
    resolve(student);
  })
}

module.exports = { 
  saveStudent,
  updateProfile,
  getStudentByUserId,
}