// ====================================================
//      Rutas API: Login
//      By TutorLab Team ©
// ====================================================

const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');

const instructorController = require('../controllers/instructor');

const studentController = require('../controllers/student');

const api = express.Router();

api.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({  $or:[{ email: body.email }, { username: body.email }]}, async (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }

         let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        let data;

        if(userDB.role == 'STUDENT_ROLE'){
            data = await studentController.getStudentByUserId(userDB.id, req, res);
        }
    
        else if(userDB.role == 'INSTRUCTOR_ROLE'){
            data = await instructorController.getInstructorByUserId(userDB.id, req, res);
        }


        res.json({
            ok: true,
            user: userDB,
            data,
            token
        })
    }) 

});


//Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

api.post('/google-signin', async(req, res) => {


    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    User.findOne({ email: googleUser.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {

            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe autenticarse ingresando correo y contraseña."
                    }
                })
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: bcrypt.hashSync('password', 10)
            });

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            });
        }
    })


});



module.exports = api;