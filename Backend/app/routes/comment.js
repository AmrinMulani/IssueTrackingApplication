const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/comments`;

    // defining routes.
    /**
        * @apiGroup comment
        * @apiVersion  1.0.0
        * @api {post} /api/v1/comments api for comment on issue.
        *
        * @apiParam {string} issueId issue id. (body params) (required)
        * @apiParam {string} description comment. (body params) (required)
        * @apiParam {string} createdBy created by. (body params) (required)
        * @apiParam {string} authToken auth token of the current user. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
            {
               "error": false,
               "message": "Comment added successfully",
               "status": 200,
               "data": {
                   "createdOn": "2019-04-19T20:41:51.000Z",
                   "_id": "5cba328f1b0b7e2e10afe32b",
                   "issueId": "7UpsUYimN",
                   "description": "hi this is the first comment",
                   "createdBy": "5cb34fcfbc8d0c2ca0b3206b",
                   "__v": 0
               }
           }
       */
    app.post(`${baseUrl}`, auth.isAuthorized, commentController.postComment);

    /**
     * @apiGroup comment
     * @apiVersion  1.0.0
     * @api {get} /api/v1/comments/get/issueId/:issueId api to get all comments on issue.
     *
     * @apiParam {string} issueId issue id. (params) (required)
     * @apiParam {string} authToken auth token for the current user. (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "comments fetched",
            "status": 200,
            "data": [
                {
                    "_id": "5cba328f1b0b7e2e10afe32b",
                    "createdOn": "2019-04-19T20:41:51.000Z",
                    "issueId": "7UpsUYimN",
                    "description": "hi this is the first comment",
                    "createdBy": {
                        "_id": "5cb34fcfbc8d0c2ca0b3206b",
                        "userId": "vhJOvZDRBV",
                        "name": "Himanshu B"
                    },
                    "__v": 0
                }
            ]
        }
    */
    app.get(`${baseUrl}/get/issueId/:issueId`, auth.isAuthorized, commentController.getComment);

    //send friend request
    // app.post(`${baseUrl}/request/create`, userController.sendFriendRequest)


}