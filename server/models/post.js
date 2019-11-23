// =============================================
//      Modelo de Post, Like, comments
//      By TutorLab Team ©
// ==============================================

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let postSchema = new Schema({
  title: {
    type: String,
    required: [true, "El título del post es requerido."]
  },
  media: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: [true, "El contenido del post es requerido"]
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El autor es requerido"]
  },
  share: {
    type: Boolean,
    default: false,
  },
  is_course: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    required: [true, "La url es requerida"]
  },
  created_at : { type: Date, required: true, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post,
}