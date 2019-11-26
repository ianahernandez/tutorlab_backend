 // ====================================================
//      Controlador: Sistema de seguimiento de Categorias
//      By TutorLab Team ©
// =====================================================

const FollowCategory = require('../models/followCategory');

let saveFollow = (req, res) => {
  let body = req.body;

  let follow = new FollowCategory({
    user: req.user._id,
    category: body.category
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
          message: "Error al seguir categoría."
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

  FollowCategory.findOne({user: user, category: followed})
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
            message: "Error al dejar de seguir categoría."
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

  FollowCategory.find({user: user_id})
    .select('-user -_id -__v')
    .populate('category', 'name img')
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
            message: "No esta siguiendo a ninguna categoría"
          }
        });
      }

      res.json({
        ok: true,
        categories: followDB,
      });

    });
}

module.exports = {
  saveFollow,
  deleteFollow,
  following
}