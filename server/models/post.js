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
    required: false
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
    required: false
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: false
  },
  ref: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: false
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: false
  },
  likes: [
    { type: Schema.Types.ObjectId, ref:'User'}
  ],
  created_at : { type: Date, required: true, default: Date.now },
});

let commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El usuario es requerido"]
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "La publicación es requerida"]
  },
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }

});

const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Post,
  Comment
}