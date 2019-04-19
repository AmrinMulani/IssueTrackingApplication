const express = require('express');
const userController = require("../controllers/userController");
const appConfig = require("./../../config/appConfig");



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
     * @api {post} /api/v1/users/register api for user registration.
     *
     * @apiParam {string} name first-name of the user. (body params) (required)
     * @apiParam {string} email last-name of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} photo photo of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created",
            "status": 200,
                     {
            "error": false,
            "message": "You are successfully registerd",
            "status": 200,
            "data": {
                "createdOn": "2019-04-19T17:35:36.000Z",
                "email": "sign@gmail.com",
                "name": "Test Signup",
                "password": "$2a$10$9yx2mKJjmiccaQlabnCdIeFdbFhF7.Z4reDIZSZ1CyZV1lizB2pmy",
                "photoUrl": "1555695336111-NT1284.jpg",
                "provider": "local",
                "providerId": "",
                "userId": "WYwqnShN-",
                "__v": 0,
                "_id": "5cba06e8a0ab9d3dbcc5721b"
            }

        }
    */
    
    app.post(`${baseUrl}/register`, upload.single('photo'), userController.register);


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


}