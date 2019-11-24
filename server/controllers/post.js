// ====================================================
//      Controlador: Post
//      By TutorLab Team ©
// ====================================================

const _ = require('underscore');

const { uploadFile } = require('./uploads');

const { Post, Like, Comment } = require('../models/post'); 

const { Course } = require('../models/course'); 

// =====================
// Crear nuevo post
// =====================

let savePost = (req, res) => {
  let body = req.body;
  let author = req.user._id;
  
  let post = new Post({
    title: body.title,
    content: body.content,
    author: author    
  });

  post.save( async (err, postDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!postDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Error al publicar."
        }
      });
    }

    if(req.files){
      req.params.type = "posts"; 
      req.params.id = postDB._id; 
      req.params.post = postDB; 
      uploadFile(req, res);
    }
    else{
      postDB
      .populate('author', 'name img')
      .execPopulate((err, post) => {
        res.json({
          ok: true,
          post
        });
      });
    }
  });
}

// =====================
// Publicar Curso
// =====================
let savePostCourse = (req, res) => {

  let body = req.body;
  let course_id = req.params.course_id;
  let author = req.user._id;

  Course.findOne({_id: course_id, instructor: author}, (err, courseDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!courseDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "El curso no existe o no tiene permisos para compartir."
        }
      });
    }

    let post = new Post({
      title: body.title,
      author: author,
      is_course: true,
      course: courseDB._id  
    });

    post.save( async (err, postDB) => {

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!postDB){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Error al publicar."
          }
        });
      }

      postDB
      .populate({path: 'course', select:'title price img created_at ranking description instructor', populate: {path: 'instructor', select: 'name img' }})
      .populate('author', 'name img')
      .execPopulate((err, post) => {
        res.json({
          ok: true,
          post
        });
      });
      
    });

  });
  
}

// =====================
// Compartir Post
// =====================
let sharePost = (req, res) => {
  let body = req.body;
  let post_id = req.params.post_id;
  let author = req.user._id;

  Post.findById(post_id, (err, postDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!postDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Publicación no econtrada."
        }
      });
    }

    let post = new Post({
      title: body.title,
      author: author,
      share: true,
      post: postDB._id,
      is_course: postDB.is_course ? true : false,
      course: postDB.is_course? postDB.course : undefined  
    });

    post.save( async (err, postDB) => {

      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!postDB){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Error al publicar."
          }
        });
      }
      postDB.populate({path: 'post', populate: { path: 'author', select: 'name img' }})
      .populate({path: 'course', select:'title price img created_at ranking description instructor', populate: {path: 'instructor', select: 'name img' }})
      .populate('author', 'name img')
      .execPopulate((err, post) => {
        res.json({
          ok: true,
          post
        });
      });
   
    });

  });
}

// =====================
// Eliminar Post
// =====================
let deletePost = (req, res) => {
  let id = req.params.id;
  let author_id = req.user._id;

  Post.find({ _id: id, author: author_id}, (err, postDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!postDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "La publicación no existe o no tiene permisos de eliminar"
        }
      });
    }

    Post.findByIdAndDelete(id, (err, post) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!post){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Error al eliminar la publicación"
          }
        });
      }

      res.json({
        ok: true,
        post
      })

    });
  });
}

// =====================
//  Guardar like a post
// =====================
let saveLike = (req, res) => {

  let id = req.params.id;
  let user_id = req.user._id;

  Post.findById(id, (err, postDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!postDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Publicación no econtrada."
        }
      });
    }

    if(postDB.likes.indexOf(user_id) < 0){
      postDB.likes.push(user_id);
    }
    
    postDB.save( (err, postbd) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!postbd){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Publicación no econtrada."
          }
        });
      }
      
      postbd
      .populate('likes', 'name img')
      .execPopulate((err, post) => {
        res.json({
          ok: true,
          post
        });
      });

    });


  });
}

// =====================
//  Eliminar like a post
// =====================

let deleteLike = (req, res) => {

  let id = req.params.id;
  let user_id = req.user._id;

  Post.findById(id, (err, postDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!postDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Publicación no econtrada."
        }
      });
    }

    
    if(postDB.likes.indexOf(user_id) >= 0){
      postDB.likes.pull(user_id);
    }
    
    postDB.save( (err, postbd) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!postbd){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Publicación no econtrada."
          }
        });
      }
      
      postbd
      .populate('likes', 'name img')
      .execPopulate((err, post) => {
        res.json({
          ok: true,
          post,
        });
      });

    });


  });
}

module.exports = {
  savePost,
  savePostCourse,
  sharePost,
  deletePost,
  saveLike,
  deleteLike

}