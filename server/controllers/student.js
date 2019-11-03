// ====================================================
//      Controlador: Estudiante
//      By TutorLab Team ©
// ====================================================

const Student = require('../models/student');

// =====================
// Guardar Estudiante
// =====================

let saveStudent = (user, res) => {

  let student = new Student({
    name: user.name,
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

module.exports = { saveStudent }