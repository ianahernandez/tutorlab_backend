// ====================================================
//      Rutas API
//      By TutorLab Team ©
// ====================================================

const express = require('express');

const app = express();

app.use( '/api', require('./images') );

app.use( '/api', require('./uploads') );

app.use( '/api', require('./user') );

app.use( '/api', require('./login') );

app.use( '/api', require('./category') );

module.exports = app;