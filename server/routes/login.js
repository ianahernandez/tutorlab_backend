const express = require('express');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const jwtSecret = require('../config/jwtConfig');

const passport = require('passport');

const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
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

        let token = '123';


        res.json({
            ok: true,
            user: userDB,
            token
        })
    })

});

app.post('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if ( err ){
            console.log(err)
        }
        if( info != undefined ){
            console.log(info.message);
            res.status(400).json({
                ok: false,
                err: info.message
            })
        } else {
            req.logIn(user, err => {
                User.findOne({ email: user.email }, (err, userDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    }
            
                    const token = jwt.sign({ id: userDB.email }, jwtSecret.secret);
            
                    res.json({
                        ok: true,
                        user: userDB,
                        token,
                        message: 'Usuario encontrado autenticado',
                    });
                });
            });
        }
    })(req, res, next);
});

module.exports = app;