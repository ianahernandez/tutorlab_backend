// ======================================================
//      Middleware: Autorización para acceso de servicios
//      By TutorLab Team ©
// ======================================================

const jwt = require('jsonwebtoken');

//================================
//    Verificacion del Token válido
//================================

let verifyUser = (req, res, next) => {

    let token = req.get('token');

    if(token != undefined){

        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (!err) {
                req.user = decoded.user;
            }  
        })

    }
    next();
    
};

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
        return res.status(403).json({
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
        return res.status(403).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    next();
}

//================================
//    Verificacion de instructor role
//================================

let verifyInstructorRole = (req, res, next) => {
    let user = req.user;
    if (user.role != 'INSTRUCTOR_ROLE') {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'El usuario no es instructor'
            }
        });
    }
    next();
}

//=====================================================
//  Verificacion de tipo usuario: NO GOOGLE Sign in
//=====================================================

let verifyUserNotGoogle = (req, res, next) => {
    let user = req.user;
    if (user.google) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Operación no permitida'
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

    let auxfile = req.files.file.name.split('.');

    if ( ['mp4','avi','mkv', ''].indexOf(auxfile[auxfile.length -1]) < 0 ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Formato inválido',
                format: auxfile[auxfile.length -1]
            }
        });
    }
    next();
}
//=====================================================
//  Verificacion de Formato de imagen jpg, jpeg, png
//=====================================================

let verifyImgFormat = (req, res, next) => {
    
    let auxfile = req.files.file.name.split('.');

    if ( ['jpg','jpeg','png'].indexOf(auxfile[auxfile.length -1]) < 0 ) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Formato inválido',
                format: auxfile[auxfile.length -1]
            }
        });
    }
    next();
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdminRole,
    verifyInstructorRole,
    verifyUserLogged,
    verifyUserNotGoogle,
    verifyTokenResetPassword,
    verifyVideoFormat,
    verifyImgFormat
}