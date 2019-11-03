// ====================================================
//      Controlador: Instructor
//      By TutorLab Team ©
// ====================================================

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

module.exports = { saveInstructor }