require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');


const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');
const paymentsRouter = require('./routes/Payments');
const mailRouter = require('./routes/Mail');

const { User } = require('./model/User');
const { isAuth, sanitizeuser, cookieExtractor } = require('./services/common');



const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

//middlewares

server.use(express.static('build'))
server.use(cookieParser());
server.use(session({
  secret: process.env.SESSION_KEY,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));
server.use(passport.authenticate('session'));
server.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);
server.use(express.json());
server.use('/products', isAuth(), productsRouter.router);
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(), usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), ordersRouter.router);
server.use('/payment', paymentsRouter.router);
server.use('/email', mailRouter.router);


// Passport Strategy

passport.use('local', new LocalStrategy(
  { usernameField: 'email' },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        done(null, false, { message: 'invalid Credential' })
      }
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'Invalid Credentials' });
          }
          const token = jwt.sign(sanitizeuser(user), process.env.JWT_SECRET_KEY);

          done(null, {id:user.id, role:user.role, token});
        })
    } catch (err) {
      done(err);
    }
  }
));

passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
  console.log({ jwt_payload });
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, sanitizeuser(user));
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));


// ye session variable create krta h 
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// ye chabge krta session variable ko call krta h after authorized req
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});



main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('database connected');
}


server.listen(process.env.PORT, () => {
  console.log('server started');
});