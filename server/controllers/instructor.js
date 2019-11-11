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

  let instructor = new Instructor({
    name: user.name,
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
            ['name', 'lastname', 'gender', 'city', 'emailPublic', 'title', 'description', 'interests'.split(','), 'social.facebook','social.linkedin', 'social.github', 'social.twitter' ]);

  body.interests = req.body.interests.split(',');


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