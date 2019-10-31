
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'El nombre es requerido']
  },
  description: {
    type: String,   
    required: false
  },
  img: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    default: true
  },

});

categorySchema.plugin( uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Category', categorySchema);