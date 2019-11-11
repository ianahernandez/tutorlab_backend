// =============================================
//      Clase abstracta de usuario público
//      By TutorLab Team ©
// ==============================================

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let publicUserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
  },
  lastname: {
    type: String,
    required: false
  },
  gender:{
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  emailPublic: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  interests: {
    type: [String],
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  social: {
    facebook: {type: String, required: false},
    twitter: {type: String, required: false},
    linkedin: {type: String, required: false},
    github: {type: String, required: false},
  }
  
});

module.exports = { PublicUser: publicUserSchema };