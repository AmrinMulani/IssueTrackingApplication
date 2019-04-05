const GOOGLE_CLIENT_ID = '1091082596943-49t59doqnuiim4fl7nuvt1229md2us09.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(GOOGLE_CLIENT_ID, 'Q3ISkgY1ZodiTMZMuFZ8Pj2C', '');

module.exports.getGoogleUser = code => {
    return client.verifyIdToken({ idToken: code, audience: GOOGLE_CLIENT_ID })
        .then(login => {
            var payload = login.getPayload();
            var audience = payload.aud;
            if (audience !== GOOGLE_CLIENT_ID) {
                throw new Error(
                    'error while authenticating google user: audience mismatch: wanted [' +
                    GOOGLE_CLIENT_ID +
                    '] but was [' +
                    audience +
                    ']'
                );
            }
            return {
                name: payload['name'],
                pic: payload['picture'],
                id: payload['sub'],
                email_verified: payload['email_verified'],
                email: payload['email']
            };
        })
        .then(user => {
            return user;
        })
        .catch(err => {
            return {
                error: true,
                message: 'error while authenticating google user: ' + JSON.stringify(err)
            };
        });
};