const express = require('express');
const userController = require("../controllers/userController");
const appConfig = require("./../../config/appConfig");

const auth = require('./../middlewares/auth')


const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
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
     * @apiParam {string} name full name of the user. (body params) (required)
     * @apiParam {string} email email/username of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} photo photo of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
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
     * @apiParam {string} username email of the user. (body params) (required)
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
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InlrV1g0eFJfQyIsImlhdCI6MTU1NTcwNDg1NzU5MCwiZXhwIjoxNTU1NzkxMjU3LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJpc3N1ZVRyYWNraW5nQXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJwVzBOajhrVklDIiwibmFtZSI6IkhpbWFuc2h1IEJoYW5kYXJpIiwicHJvdmlkZXIiOiJsb2NhbCIsInByb3ZpZGVySWQiOiIiLCJwaG90b1VybCI6IjE1NTUzMTU1NzE3MTMtbXkuanBnIiwiX2lkIjoiNWNiNDNiNzM4MzY2ZmMwZWQ4OTI1NTliIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSJ9fQ.KedVVFLQcfQUG3ex0YT07CDpz1V9lUUsNDv5GWyu0PA",
                "userDetails": {
                    "userId": "pW0Nj8kVIC",
                    "name": "Himanshu Bhandari",
                    "provider": "local",
                    "providerId": "",
                    "photoUrl": "1555315571713-my.jpg",
                    "_id": "5cb43b738366fc0ed892559b",
                    "email": "test@gmail.com"
                }
            }
        }
    */
    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);



    app.post(`${baseUrl}/signInSocial`, userController.signInSocial);


    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/get api to get all the users.
     *
     * @apiParam {string} authToken authToken. (body/query or params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Users data found successfully",
            "status": 200,
            "data": [
                {
                    "_id": "5ca63cb524d6040bf06b62a8",
                    "userId": "1m-ieawrN",
                    "name": "himanshu bhandari"
                },
                {
                    "_id": "5ca7333f10b7af23348eb1df",
                    "userId": "1m-ieawrO",
                    "name": "vineej kumar singh"
                },
                {
                    "_id": "5ca736cff334764b48a23d43",
                    "userId": "dbfxQORx0",
                    "name": "vineej chauhan"
                },
                {
                    "_id": "5ca74c4d20b2101f90d25bf9",
                    "userId": "ck-qsTLBg",
                    "name": "Himanshu Bhandari"
                },
                {
                    "_id": "5cb34fcfbc8d0c2ca0b3206b",
                    "userId": "vhJOvZDRBV",
                    "name": "Himanshu B"
                },
                {
                    "_id": "5cb41f0a0f6f55282028f4d9",
                    "userId": "FyHwPHDQLN",
                    "name": "Varun D"
                },
                {
                    "_id": "5cb41f570f6f55282028f4db",
                    "userId": "sVammxSXN-",
                    "name": "Himanshu Bhandari"
                },
                {
                    "_id": "5cb446b262a7d22fecc4f715",
                    "userId": "1qG-4vffWR",
                    "name": "Final Test User Local"
                },
                {
                    "_id": "5cb864b8302a0b4390009ba3",
                    "userId": "W62AK9vka",
                    "name": "Himanshu Bhandari"
                },
                {
                    "_id": "5cb99ef9eb6ae918c0cd2a1a",
                    "userId": "ERr0ICpt-",
                    "name": "Nikhil"
                },
                {
                    "_id": "5cba06e8a0ab9d3dbcc5721b",
                    "userId": "WYwqnShN-",
                    "name": "Test Signup"
                }
            ]
        }
    */

    app.get(`${baseUrl}/get`, auth.isAuthorized, userController.getAllUsers);

    
    app.post(`${baseUrl}/create`, upload.array('photos'), userController.createIssue);


}