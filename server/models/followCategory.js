// ====================================================
//      Modelo de Follows de Categorias
//      By TutorLab Team ©
// ====================================================

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let followCategorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }
});

module.exports =  mongoose.model('FollowCategory', followCategorySchema);