const passport = require('passport');
const passportFacebook = require('passport-facebook');
// const config = require('../config');
const users = require('../controllers/users');

const passportConfig = {
    clientID: '1300603060105584',
    clientSecret: 'de07c12e3ab78a05a2aede1053947db4',
    callbackURL: 'http://localhost:3000/api/authentication/facebook/redirect'
};

if (passportConfig.clientID) {
    console.log('Hiiiii')
    passport.use(new passportFacebook.Strategy(passportConfig, function(accessToken, refreshToken, profile, done) {
        // let user = users.getUserByExternalId('facebook', profile.id);
        // if (!user) {
        //     user = users.createUser(profile.displayName, 'facebook', profile.id);
        // }
        return done(null, profile);
        // console.log('profile');
        // console.log(profile);
        // return done(null, null, 'done');
    }));
}