const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const appConfig = require("./../../config/appConfig");

const token = require('../libs/tokenLib');

const passport = require('passport');
require('../middlewares/facebook');
require('../middlewares/google');
require('../middlewares/jwt');

const multer = require('multer');

var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    //const auth = require('../middlewares/auth');

var upload = multer({ storage: storage })
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user signup.
     *
     * @apiParam {string} firstName first-name of the user. (body params) (required)
     * @apiParam {string} lastName last-name of the user. (body params) (optional)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} mobileNumber mobile number of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created",
            "status": 200,
            "data": {
                "userId": "XE14LO_NJ",
                "firstName": "Himanshu",
                "lastName": "",
                "email": "bhandarihimanshu6@gmail.com",
                "mobileNumber": 918743967663,
                "createdOn": "2019-03-08T09:58:16.000Z",
                "_id": "5c823cb81ca96210b83ff6ba",
                "__v": 0
            }
        }
    */
    // params: email, password.
    //app.post(`${baseUrl}/signup`, userController.signUpFunction);


    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
                }
            }
        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);


    app.post(`${baseUrl}/signInSocial`, userController.signInSocial);


    app.get(`${baseUrl}/get`, userController.getAllUsers);

    app.post(`${baseUrl}/create`, upload.array('photos'), userController.createIssue);
    app.post(`${baseUrl}/get/all`, upload.array('photos'), userController.getAllReq);


    app.post(`${baseUrl}/register`, upload.single('photo'), userController.register);
    //     scope: ['email', 'public_profile', 'user_location', 'id',
    //     'first_name',
    //     'last_name',
    //     'middle_name',
    //     'name',
    //     'name_format',
    //     'picture',
    //     'short_name'
    // ],
    app.use(passport.initialize());


    app.get('/api/authentication/google/start',
        passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }));
    app.get('/api/authentication/google/redirect',
        passport.authenticate('google', { session: false }), generateUserToken);

    app.get('/api/authentication/facebook/start',
        passport.authenticate('facebook', {
            scope: ['email', 'public_profile', 'user_location'],
            session: false
        }));
    app.get('/api/authentication/facebook/redirect',
        passport.authenticate('facebook', { session: false, failureRedirect: '/login' }));
    //get all users
    //app.get(`${baseUrl}/get/all`, userController.getAllUsers);


    //get notifications
    //app.get(`${baseUrl}/get/notifications`, userController.getNotifications);
    //send friend request
    // app.post(`${baseUrl}/request/create`, userController.sendFriendRequest)

    function generateUserToken(req, res) {
        const t = "";
        token.generateToken(result, (err, tokenDetails) => {
            if (err) {
                console.log('err');
                console.log(err);
            } else {
                tokenDetails.userId = req.user.id;
                tokenDetails.userDetails = result;
                console.log('tokenDetails')
                console.log(tokenDetails)
                token = tokenDetails;

                res.send(t);
            }

        });
    }

}