// =============================================
//      Modelo de Cursos, secciones y clases
//      By TutorLab Team ©
// ==============================================

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

let lessonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: false,
  },
  external_resources: {
    type: [resourceSchema],
    required:false,
  }
});

let sectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: {
    type: [lessonSchema],
    required:false,
  }
});

let courseSchema = new Schema({
  title:{
    type: String,
    required: true,
  },
  subtitle:{
    type: String,
    required: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: mongoose.Decimal128,
    required: false,
    default: 0
  },
  img: {
    type: String,
    required: false
  },
  video: {
    type: String,
    required: false
  },
  to_learn: {
    type: [String],
    required: false
  },
  requirements: {
    type: [String],
    required: false
  },
  target_group: {
    type: [String],
    required: false
  },
  status: {
    type: Boolean,
    default: false
  },
  messages: {
    type: Map,
    of: String
  },
  sections: {
    type: [sectionSchema],
    required:false,
  }
});

const Course = mongoose.model('Course', courseSchema);
const Section = mongoose.model('Section', sectionSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const ExternalResource = mongoose.model('ExternalResource', resourceSchema);

module.exports = {
  Course,
  Section,
  Lesson,
  ExternalResource
}