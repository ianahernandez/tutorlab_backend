// =============================================
//      Modelo de Cursos, secciones y clases
//      By TutorLab Team ©
// ==============================================

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let validStatus = {
  values: ['DRAFT', 'IN_REVIEW', 'APPROVED', 'REFUSED'],
  message: '{VALUE} no es un estado válido' 
}

let resourceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  lesson: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
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
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
  },
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
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
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
    default:''
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: false,
    default:''
  },
  description: {
    type: String,
    required: false,
    default:''
  },
  price: {
    type: Number,
    required: false,
    default: 0,
    min: [0, 'Precio inválido'],
  },
  img: {
    type: String,
    required: false,
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
  messages: {
    welcome: {
      type: String,
      default:''
    },
    finished: {
      type: String,
      default:''
    },
  },
  sections: {
    type: [sectionSchema],
    required:false,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  ranking: {
    type: Number,
    required: false,
    default: 0,
  }, 
  status: {
    type: String,
    default: 'DRAFT',
    enum: validStatus
  },
  active: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  created_at : { type: Date, required: true, default: Date.now },
  update_at  : { type: Date, required: true, default: Date.now },
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