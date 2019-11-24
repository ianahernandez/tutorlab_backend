// ====================================================
//      Controlador: Usuario
//      By TutorLab Team ©
// ====================================================

const bcrypt = require('bcrypt');

const _ = require('underscore');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const mongoose = require('mongoose')

const instructorController = require('./instructor');

const studentController = require('./student');

const Follow = require('../models/follow');

const mailController = require('./mail');


// =====================
// Guardar Usuario
// =====================

let saveUser = (req, res) => {
  let body = req.body;

  let data; 

  let user = new User({
    name: body.name,
    email: body.email,
    username: body.username,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save( (err, userDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(user.role == 'STUDENT_ROLE'){
      data = studentController.saveStudent(userDB, res);
    }

    else if(user.role == 'INSTRUCTOR_ROLE'){
      data = instructorController.saveInstructor(userDB, res);
    }
    
    res.json({
      ok: true,
      user: userDB,
      data
    });

  });
}

// ==========================
// Obtener todos los usuarios
// ==========================

let getUsers = (req, res) => {

  let from = req.query.from || 0;
  from = Number(from);

  let limit = req.query.limit || 30;
  limit = Number(limit);


  User.find({ status: true }) //Mostrar solo los campos indicados en el segundo parametro
      .skip(from)
      .limit(limit)
      .exec( (err, users) => {

        if(err){
          return res.status(400).json({
            ok: false,
            err
          });
        }

        User.countDocuments({ status: true }, (err, count) =>{

          followUserIds(req.user._id).then((ids) => {
            // console.log(ids)
            res.json({
              ok: true,
              users,
              usersFollowing: ids.following,
              usersFollowMe: ids.followme,
              count
            });
          });
          

        });

      });
}

// ==========================
// Sugerir usuarios
// ==========================
let getSuggestUsers = (req, res) => {
  followUserIds(req.user._id).then((ids) => {
    let following = ids.following;
    let followers = ids.followme;

    User.find({status: true, "_id" : { $nin: following.concat(followers) } }, (err, userDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!userDB){
        return res.status(400).json({
          ok: false,
          err: {
            message: "No hay coicidencias"
          }
        });
      }

      res.json({
        ok: true,
        users: userDB
      });

    });
  });
}

// ==========================
// Obtener usuario por Id
// ==========================

let getUserById = (req, res) => {
  let id = req.params.id;
  let user_id = req.user._id;
  User.findById(id, (err, userDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if(!userDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      })
    }
    Follow.find({ $or: [{user: id, followed: user_id}, {followed: id, user: user_id}] }, async (err, followsDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!followsDB){
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se puede comprobar el seguimiento"
          }
        })
      }

      let following = (followsDB.filter(follow => follow.user == user_id).length > 0);
      let followme = (followsDB.filter(follow => follow.user == id).length > 0);

      let data;

      if(userDB.role == 'STUDENT_ROLE'){
          data = await studentController.getStudentByUserId(userDB.id, req, res);
      }
  
      else if(userDB.role == 'INSTRUCTOR_ROLE'){
          data = await instructorController.getInstructorByUserId(userDB.id, req, res);
      }


      return res.json({
        ok: true,
        user: userDB,
        data,
        following,
        followme
      })
    });
  });
}
// =====================
// Actualizar un usuario
// =====================

let updateUser =  (req, res) => {

  let id = req.params.id;

  let body = _.pick( req.body, ['name','lastname', 'username', 'email', 'status']);

  let bodyuser = body;

  bodyuser.name = `${body.name} ${req.body.lastname}`

  User.findByIdAndUpdate( id, bodyuser, {new: true, runValidators: true,  context: 'query'}, async (err, userDB) => {

    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if(userDB.role == 'STUDENT_ROLE'){
      data = await studentController.updateProfile(userDB.id, req, res);
    }

    else if(userDB.role == 'INSTRUCTOR_ROLE'){
      data = await instructorController.updateProfile(userDB.id, req, res);
    }

    res.json({
      ok: true,
      user: userDB,
      data
    });

  });

}

// =====================
// Cambiar contraseña
// =====================

let changePassword = (req, res) =>{

  let body = req.body;

  User.findById(req.params.id,(err, userDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
    if (!bcrypt.compareSync(body.old_password, userDB.password)) {
      return res.status(400).json({
          ok: false,
          err: {
              message: 'Contraseña incorrecta'
          }
      })
    }

    if(body.password != body.password_confirm){
      return res.status(400).json({
        ok: false,
        err: {
            message: 'Los datos no coinciden'
        }
     });
    }

    userDB.password = bcrypt.hashSync(body.password, 10);

    userDB.save( (err, userbd) => {
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
      });
    });

  });

}

// =====================
// Recuperar contraseña
// =====================

// Envío de instrucciones por correo
let forgotPassword = (req, res) => {

  let email = req.body.email;

  User.findOne({email: email}, (err, userDB) => {

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }

    if (!userDB) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo no registrado.'
            }
        })
    }

    let token = jwt.sign({
        user: userDB._id,
        reset: true,
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    let text = `Use el siguiente enlace para recuperar la contraseña -> localhost:3000/api/reset/${token}`

    console.log(token);

    //mailController.sendMail(userDB.email, "Recuperar contraseña", text)

    res.json({
        ok: true,
        user: userDB,
        token
    })

  })

}

// Verificacion de URL: token de cambio de contraseña
let authReset = (req, res) => {

    let user = User.findById(req.user, (err, userDB) => {
      if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
      }
      
      if(!userDB){
        return res.status(401).json({
          ok: false,
          err: {
              message: 'Url inválida'
          }
      });

      }
      return res.json({
        ok: true,
        user: userDB,
      })

    })
    
}

// Cambiar contraseña
let passwordReset = (req, res) => {

    if( req.body.password != req.body.passwordconfirm){
      return res.status(401).json({
          ok: false,
          err: {
              message: 'Las contraseñas no coinciden'
          }
      });
    }

    let body = req.body;

    let user = req.user; 

    let changePassword = {
      password: bcrypt.hashSync(body.password, 10)
    }

    User.findByIdAndUpdate(user._id, changePassword, {new: true, context: 'query'}, (err, userDB) => {
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
      }
  
      res.json({
        ok: true,
        user: userDB
      });
    });
}

// =====================
// Eliminar un usuario
// =====================

let deleteUser = (req, res) => {
  
  let id = req. params.id;

  let cambiarEstado = {
    status: false
  }

  User.findByIdAndUpdate( id, cambiarEstado, {new: true, context: 'query'}, (err, userDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if( !userDB ){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

}


async function followUserIds (user_id) {

  let following = []; 
  let followme = [];

  let aux_following = await Follow.find({ user: user_id }).select({'_id':0, '__v':0, 'user':0})

  let aux_followme = await Follow.find({ followed: user_id }).select({'_id':0, '__v':0,'followed':0});

  aux_following.forEach( follow => following.push(follow.followed));

  aux_followme.forEach( follow => followme.push(follow.user));

  return {
    following,
    followme
  }
  
}

module.exports = { 
  saveUser, 
  getUsers, 
  getUserById,
  getSuggestUsers,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  authReset,
  passwordReset,
  followUserIds
}

