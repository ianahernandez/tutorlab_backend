

const jwtSecret = require('./jwtConfig');

const bcrypt = require('bcrypt');

const BCRYPT_SALT_ROUNDS = 10;

const passport = require('passport'), 
      localStrategy = require('passport-local').Strategy,
      User = require('../models/user'),
      jwtStrategy = require('passport-jwt').Strategy,
      ExtractJWT = require('passport-jwt').ExtractJwt


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('register', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const userDB = await User.findOne({'email': email});
  console.log(userDB);
  if(userDB) {
    console.log('El correo electrónico ya se encuentra registrado.');
    return done(null, false, { message: 'El correo electrónico ya se encuentra registrado.' });
  } else {

    const newUser  = new User({
      name: 'Nombre passport',
      email: email,
      password: bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS),
      // img: body.img,
      // role: body.role
    });

    console.log(newUser);
    await newUser.save();
    done(null, newUser);
  }
}));

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const userDB = await User.findOne({email: email});
    if(!userDB) {
      console.log('(Usuario) o contraseña incorrecta.');
      return done(null, false, { message: '(Usuario) o contraseña incorrecta.' });
    }
    if( !bcrypt.compareSync(password, userDB.password) ) {
      console.log('Usuario o (contraseña) incorrecta.');
      return done(null, false, { message: 'Usuario o (contraseña) incorrecta.'});
    }
    console.log('Usuario autenticado');
    return done(null, userDB);
    
  } catch (err) {
    done(err);
  }
  
}));


const opts = { 
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret.secret,
}

passport.use(
  'jwt',
  new jwtStrategy(opts, (jwt_payload, done) => {

      User.findOne({ email: jwt_payload.id }, (err, userDB) => {
        if (err) {
          console.log('Error interno');
          done(err);
        }

        if(userDB) {
          console.log('Usuario encontrado en DB con passport');
          done(null, userDB);
        }else{
          console.log('Usuario no encontrado');
          done(null, false);
        }
      });

  }),
);