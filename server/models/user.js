// ====================================================
//      Modelo de Usuarios (Datos de registro)
//      By TutorLab Team ©
// ====================================================

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
  values: ['ADMIN_ROLE', 'STUDENT_ROLE', 'INSTRUCTOR_ROLE'],
  message: '{VALUE} no es un rol válido' 
}

let Schema = mongoose.Schema;


let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'El username es requerido']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es requerido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'STUDENT_ROLE',
    enum: validRoles
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.toJSON = function () {

  let useraux = this;
  let userObject = useraux.toObject();
  delete userObject.password;

  return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('User', userSchema);