import passport from 'passport'; // passport MAIN
import { usersModel } from '../persistencia/models/users.models.js';
import { Strategy as LocalStrategy } from 'passport-local'; // passport Local
import { hashPassword } from '../utils.js';
import { Strategy as GitHubStrategy } from 'passport-github2'; // passport GitHub


/* estrategia Local*/
passport.use('registro', new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true, 
}, async (req, email, password, done) => {
    const user = await usersModel.findOne({ email });
    if (user) {
        return done(null, false);
    } else {
        const hashNewPassword = await hashPassword(password);
        const newUser = { ...req.body, password: hashNewPassword }
        const newUserBD = await usersModel.create(newUser);
        done(null, newUserBD)
    }
}
))


// GitHub Strategy
passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.51a03f00b04bd986',
    clientSecret: '40add4571b1bb8d876a1663a4878bd67c05ef0d1',
    callbackURL: 'http://localhost:8080/users/github' 
}, async (accessToken, refreshToken, profile, done) => {
    const user = await usersModel.findOne({ email: profile._json.email }); 
    if (!user) { 
        const newUser = {
            first_name: profile._json.name.split(' ')[0],
            last_name: profile._json.name.split(' ')[1] || ' ',
            email: profile._json.email,
            password: ' ',
            isGithub: true,
        }
        const userDB = await usersModel.create(newUser);
        done(null, userDB);
    } else {
        done(null, user); 
    }
}))



passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
});


