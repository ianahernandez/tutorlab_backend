// ====================================================
//      Modelo de Instructores (heredado de Public User)
//      By TutorLab Team ©
// ====================================================

const mongoose = require('mongoose');

const extendSchema = require('mongoose-extend-schema');

const { PublicUser } = require('./publicUser');

let instructorSchema = extendSchema(PublicUser, {
  speciality: {
    type: String, 
    required: false
  },
  ranking: {
    type: mongoose.Decimal128,
    required: false,
    default: 0,
  },  
});

instructorSchema.methods.toJSON = function () {

  let aux = this;
  let instructorObject = aux.toObject();
  delete instructorObject.user;
  return instructorObject;
}

module.exports = mongoose.model('Instructor', instructorSchema);