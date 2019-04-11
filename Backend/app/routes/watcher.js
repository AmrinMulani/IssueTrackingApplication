const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/watch`;

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

    // body params: issueId, userId.
    app.post(`${baseUrl}`, auth.isAuthorized, commentController.addWatcher);

    app.get(`${baseUrl}/get/issueId/:issueId`, auth.isAuthorized, commentController.getWatchers);

    //send friend request
    // app.post(`${baseUrl}/request/create`, userController.sendFriendRequest)


}