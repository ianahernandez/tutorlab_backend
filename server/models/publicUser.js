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
    default: "Andres"
  },
  lastname: {
    type: String,
    required: false
  },
  gender:{
    type: String,
    required: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
});

module.exports = { PublicUser: publicUserSchema };