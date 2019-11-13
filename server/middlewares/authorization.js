// ======================================================
//      Middleware: Autorización para acceso de servicios
//      By TutorLab Team ©
// ======================================================

const jwt = require('jsonwebtoken');

//================================
//    Verificacion del Token válido
//================================

let verifyToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.user = decoded.user;
        next();
    })
};

//==================================
//    Verificacion usuario loggeado
//==================================

let verifyUserLogged = (req, res, next) => {

    let id = req.params.id;

    let user = req.user;

    if (user._id != id) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos.'
            }
        });
    }
    next();
}

//================================
//    Verificacion de adminRole
//================================

let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    next();
}

//=====================================================
//  Verificacion de URL: token de cambio de contraseña
//=====================================================
let verifyTokenResetPassword = (req, res, next) => {

    let token = req.body.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'URL inválida'
                }
            });
        }

        req.user = decoded.user;
        req.reset = decoded.reset;

        console.log(req.user);

        if (! req.reset ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Url inválida'
                }
            });
        }
        next();
    })
  
}

//=====================================================
//  Verificacion de Formato de video mp4, avi
//=====================================================

let verifyVideoFormat = (req, res, next) => {
    let auxfile = req.params.src.split('.');

    if ( auxfile[auxfile.length -1].indexOf('mp4','avi') < 0 ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Url inválida'
            }
        });
    }
    next();
}
//=====================================================
//  Verificacion de Formato de imagen jpg, jpeg, png
//=====================================================

let verifyImgFormat = (req, res, next) => {

    let auxfile = req.params.img.split('.');

    if ( auxfile[auxfile.length -1].indexOf('jpg','jpeg','png') < 0 ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Url inválida'
            }
        });
    }
    next();
}

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyUserLogged,
    verifyTokenResetPassword,
    verifyVideoFormat,
    verifyImgFormat
}