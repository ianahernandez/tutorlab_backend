// ====================================================
//      Controlador: Instructor
//      By TutorLab Team ©
// ====================================================

const _ = require('underscore');

const Instructor = require('../models/instructor');

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

module.exports = { 
  saveInstructor,
  updateProfile,
  getInstructorByUserId,
}