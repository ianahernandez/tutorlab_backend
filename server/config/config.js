

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