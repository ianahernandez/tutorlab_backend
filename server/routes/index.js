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

app.use( '/api', require('./course') );

app.use( '/api', require('./follow') );

app.use( '/api', require('./instructor') );

module.exports = app;