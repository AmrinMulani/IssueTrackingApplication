const express = require('express');
const router = express.Router();
const issueController = require("../controllers/issueController");
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

var upload = multer({
    storage: storage
});
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/issues`;

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
    app.post(`${baseUrl}/get/reportedBy/:assignedTo`, auth.isAuthorized, issueController.getIssuesReporterWise);
    //get all issues
    app.post(`${baseUrl}/get/all`, auth.isAuthorized, issueController.getAllIssue);

    app.get(`${baseUrl}/get/count`, auth.isAuthorized, issueController.getCountDasboard);

    app.get(`${baseUrl}/view/:issueId`, auth.isAuthorized, issueController.viewByIssueId);

    app.post(`${baseUrl}/get/createdby/:createdBy`, auth.isAuthorized, issueController.getAllIssuePostedByUser);

    app.post(`${baseUrl}/create/:issueId/upload`, upload.single('photo'), auth.isAuthorized, issueController.uploadPhoto);
    //delete photo
    app.delete(`${baseUrl}/delete/photo`, auth.isAuthorized, issueController.deletePhoto);

    app.put(`${baseUrl}/:issueId`, auth.isAuthorized, issueController.updateIssue);
    //get notifications
    //app.get(`${baseUrl}/get/notifications`, userController.getNotifications);
    //send friend request
    // app.post(`${baseUrl}/request/create`, userController.sendFriendRequest)
}