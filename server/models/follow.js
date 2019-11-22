// ====================================================
//      Modelo de Follows
//      By TutorLab Team ©
// ====================================================

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let followSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  followed: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports =  mongoose.model('Follow', followSchema);