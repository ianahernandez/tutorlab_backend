// ====================================================
//      Modelo de Esdtudiantes (heredado de Public User)
//      By TutorLab Team ©
// ====================================================

const mongoose = require('mongoose');

const extendSchema = require('mongoose-extend-schema');

const { PublicUser } = require('./publicUser');

let studentSchema = extendSchema(PublicUser, {
   
});

studentSchema.methods.toJSON = function () {

  let aux = this;
  let studentObject = aux.toObject();
  delete studentObject.user;
  return studentObject;
}

module.exports = mongoose.model('Student', studentSchema); 