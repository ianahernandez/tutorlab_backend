

// ===============================
//  Puerto
// ===============================
process.env.PORT = process.env.PORT || 3000;

//================================
//            Entorno
//================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//            Base de datos
//================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://172.17.0.2:27017/tutorlab';
} else {
    urlDB = process.env.MONGO_URI;
    // urlDB = 'mongodb+srv://tutorlab:ZE4u7hEHigVfSSjW@cluster0-kheys.mongodb.net/tutorlab'
}
process.env.URLDB = urlDB;

//================================
//    Vencimiento del Token
//================================
//60 segundos
//60 minutos
//24 horas 

//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';




//================================
//     Seed de autenticación
//================================

process.env.SEED = process.env.SEED || 'secret-dev'
//process.env.SEED = 'secret-prod'


//================================
//     Google client id
//================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1058838072967-d3lqfaogeksqj34vctq24rth4clmuh5d.apps.googleusercontent.com';