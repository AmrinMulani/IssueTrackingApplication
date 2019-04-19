const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentController");
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/watch`;
    // defining routes.

    
    /**
     * @apiGroup watcher
     * @apiVersion  1.0.0
     * @api {post} /api/v1/watch/ api to add watcher.
     *
     * @apiParam {string} issueId issue id. (params) (required)
     * @apiParam {string} userID watcher user id. (params) (required)
     * @apiParam {string} authToken auth token for the current user. (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "You've successfully added as watcher for the issue",
            "status": 200,
            "data": {
                "createdOn": "2019-04-19T20:58:32.000Z",
                "_id": "5cba3678ab92f420c01496f7",
                "issueId": "7UpsUYimN",
                "watcherId": "5cb34fcfbc8d0c2ca0b3206b",
                "__v": 0
            }
        }
    */
    // body params: issueId, userId.
    app.post(`${baseUrl}`, auth.isAuthorized, commentController.addWatcher);

     /**
     * @apiGroup watcher
     * @apiVersion  1.0.0
     * @api {get} /api/v1/watch/get/issueId/:issueId api to get watcher list.
     *
     * @apiParam {string} issueId issue id. (params) (required)
     * @apiParam {string} authToken auth token for the current user. (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "watchers fetched",
            "status": 200,
            "data": [
                {
                    "_id": "5cba3678ab92f420c01496f7",
                    "createdOn": "2019-04-19T20:58:32.000Z",
                    "issueId": "7UpsUYimN",
                    "watcherId": {
                        "_id": "5cb34fcfbc8d0c2ca0b3206b",
                        "userId": "vhJOvZDRBV",
                        "name": "Himanshu B"
                    },
                    "__v": 0
                }
            ]
        }
    */

    app.get(`${baseUrl}/get/issueId/:issueId`, auth.isAuthorized, commentController.getWatchers);

    //send friend request
    // app.post(`${baseUrl}/request/create`, userController.sendFriendRequest)


}