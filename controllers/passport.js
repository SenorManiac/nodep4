const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/manageUsers'); 
const bcrypt = require('bcrypt');



passport.serializeUser((user, done) => {
    done(null, user.id); 
});


passport.deserializeUser(async (id, done) => {
    try {
        const start = Date.now();
        const user = await User.findById(id);
        const duration = Date.now() - start;
        done(null, user);
    } catch (err) {
        done(err);
    }
});


passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        console.log(username);
        const user = await User.checkIfUserExists(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        console.log(password)
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

module.exports = passport;
