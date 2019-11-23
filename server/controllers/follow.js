// ====================================================
//      Controlador: Sistema de seguimiento
//      By TutorLab Team ©
// =====================================================

const User = require('../models/user');

const Follow = require('../models/follow');

const { followUserIds } = require('./user');

let saveFollow = (req, res) => {
  let body = req.body;

  let follow = new Follow({
    user: req.user._id,
    followed: body.followed
  });

  follow.save( (err, followDB) => {

    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!followDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: "Error al seguir usuario."
        }
      });
    }

    res.json({
      ok: true,
      follow: followDB
    });

  });
}

let deleteFollow = (req, res) => {
  let user = req.user._id;
  let followed = req.params.id;

  Follow.findOne({user: user, followed: followed})
    .remove((err, followDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(!followDB){
        return res.status(400).json({
          ok: false,
          err: {
            message: "Error al dejar de seguir usuario."
          }
        });
      }
      res.json({
        ok: true,
        follow: followDB
      });
    });
}

let following = (req, res) => {
  let user_id = req.params.id || req.user._id ;

  Follow.find({user: user_id})
    .select('-user -_id -__v')
    .populate('followed', 'name img username')
    .exec( (err, followDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
  
      if(!followDB){
        return res.status(404).json({
          ok: false,
          err: {
            message: "No esta siguiendo a ningún usuario."
          }
        });
      }

      followUserIds(req.user._id).then((ids) => {
        res.json({
          ok: true,
          follows: followDB,
          usersFollowMe: ids.followme,
        });
      });
    });
}

let followMe = (req, res) => {

  let user_id = req.params.id || req.user._id ;

  Follow.find({followed: user_id})
    .select('-followed -_id -__v')
    .populate('user', 'name img username')
    .exec( (err, followDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        });
      }
  
      if(!followDB){
        return res.status(404).json({
          ok: false,
          err: {
            message: "Aún no tienes seguidores."
          }
        });
      }

      followUserIds(req.user._id).then((ids) => {
        res.json({
          ok: true,
          follows: followDB,
          usersFollowing: ids.following,
        });
      });
    });
}

module.exports = {
  saveFollow,
  deleteFollow,
  following,
  followMe
}

