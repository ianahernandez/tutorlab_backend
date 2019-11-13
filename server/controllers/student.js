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

  let nameTokens = user.name.split(' ');
  let name = nameTokens[0];
  let lastname = "";
  if(nameTokens.length > 1){ 
    lastname = nameTokens.slice().splice(1, nameTokens.length-1).join(' ');
  }

  let student = new Student({
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
            ['name', 'lastname', 'gender', 'dateBorn', 'city', 'emailPublic', 'title', 'description', 'interests', 'social' ]);

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