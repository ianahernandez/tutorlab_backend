const jwt = require('jsonwebtoken');

//================================
//    Verificacion del Token
//================================

let verificarToken = (req, res, next) => {

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

//================================
//    Verificacion de adminRole
//================================

let verificarAdminRole = (req, res, next) => {
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

module.exports = {
    verificarToken,
    verificarAdminRole
}