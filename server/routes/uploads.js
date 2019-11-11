


const express = require('express');

const api = express.Router();

const fileUpload = require('express-fileupload');

const uploadController = require('../controllers/uploads')

//Opciones por defecto

api.use(fileUpload());

api.put('/upload/:type/:id', uploadController.uploadFile);

module.exports = api;