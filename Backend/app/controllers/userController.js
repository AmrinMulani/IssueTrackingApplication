/* external libraries */
const mongoose = require('mongoose');
const shortid = require('shortid');

/* Libraries */
const logger = require('./../libs/loggerLib');
const check = require('./../libs/checkLib');
const validateInput = require('./../libs/validateInputLib');
const response = require('./../libs/responseLib');
const time = require('./../libs/timeLib');
const passwordLib = require('../libs/passwordLib');
const token = require('../libs/tokenLib');
//to titlecase library
const titleCase = require('title-case');
/* Models */
const UserModel = mongoose.model('User');
const AuthModel = require('../models/Auth.js');

const IssueModel = mongoose.model('Issue');

const googleAuth = require('./google-auth');
const facebookAuth = require('./facebook-auth');
const GOOGLE_CLIENT_ID = '1091082596943-49t59doqnuiim4fl7nuvt1229md2us09.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(GOOGLE_CLIENT_ID, 'Q3ISkgY1ZodiTMZMuFZ8Pj2C', '');


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
let loginFunction = (req, res) => {
    // let getUser = (req, res) => {
    //     return new Promise((resolve, reject) => {
    //         const body = req.body;
    //         const typeOfReq = body.type;
    //         console.log(typeOfReq);
    //         if (typeOfReq === 'google') {
    //             googleAuth.getGoogleUser(body.idToken)
    //             .then(apiResponse => {
    //                 console.log('apiResponse')
    //                 console.log(apiResponse)
    //                 resolve(apiResponse)
    //             });
    //         }
    //     });
    // }; //end of getUser

    let getUser = (req, res) => {
        const body = req.body;
        const typeOfReq = body.type;
        switch (typeOfReq) {
            case 'google':
                return googleAuth
                    .getGoogleUser(body.idToken)
                    .then(apiResponse => {
                        if (apiResponse.error) {
                            console.log('error hai');
                            console.log('apiResponse' + apiResponse.message);
                            throw new Error(apiResponse.message);
                        } else {
                            console.log('response hai');
                            console.log('apiResponse' + apiResponse);
                        }
                        return apiResponse;
                    }).catch(e => {
                        console.log('e');
                        console.log(Object.keys(e));
                        let error = {
                            error: true,
                            status: 404,
                            message: e.message,
                            data: null
                        }
                        res.send(error)
                    });
                break;
            case 'facebook':
                return facebookAuth.getUser(login.code).then(response => {
                    const content = {
                        token: createToken(response),
                        user: response
                    };
                    return apiResponse;
                });
                break;
            default:
                return new Error('unknow token type [' + type + ']');
        }
    };
    let findAndSaveUser = (apiResponse) => {
        console.log('im inside find and save user')
        console.log(apiResponse.email)

        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': apiResponse.email }, (err, result) => {
                if (err) {
                    logger.error(err.message, 'userController : findAndSaveUser', 10);
                    reject(true, 'Unable to find user details', 400, null);
                } else if (!result) {
                    console.log('inside result not found of find user')
                    console.log('inside ' + apiResponse)
                    console.log('result')
                    console.log(result)
                    console.log('result not found')
                    let newUser = new UserModel({
                        userId: shortid.generate(),
                        name: apiResponse.name,
                        email: apiResponse.email.toLowerCase(),
                        password: '',
                        provider: req.body.type,
                        providerId: apiResponse.id,
                        photoUrl: apiResponse.pic,
                        createdOn: time.now()
                    });
                    newUser.save((err, newUser) => {
                        if (err) {
                            //console.log(err)
                            logger.error(err.message, 'userController : findAndSaveUser', 10);
                            reject(true, 'Unable to create new user details', 400, null);
                        } else {
                            let result = newUser.toObject();
                            resolve(result);
                        }
                    })
                } else {
                    resolve(result);
                }
            });
        });
    }; //end of findAndSaveUser
    let createToken = (result) => {
        console.log('inside create token method');
        console.log('result inserted or fetched')
        console.log(result)

        //start of generate token
        return new Promise((resolve, reject) => {
            token.generateToken(result, (err, tokenDetails) => {
                if (err) {
                    console.log('err');
                    console.log(err);
                    reject(response.generate(true, 'Failed To Generate Token', 500, null))
                } else {
                    tokenDetails.userId = result.userId;
                    tokenDetails.userDetails = result;
                    console.log('tokenDetails')
                    console.log(tokenDetails)
                    resolve(tokenDetails);
                }
            })
        })
    }; //end of createToken method

    let saveToken = (tokenDetails) => {
        console.log('tokenDetails')
        console.log(tokenDetails);
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId },
                (err, retrievedTokenDetails) => {
                    if (err) {
                        logger.error(err, 'userController : saveToken', 10);
                        let apiResponse = response.generate(true, 'Failed to generate token',
                            500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(retrievedTokenDetails)) {
                        //console.log('empty auth token')
                        let newAuthToken = new AuthModel({
                            userId: tokenDetails.userId,
                            authToken: tokenDetails.token,
                            tokenSecret: tokenDetails.tokenSecret,
                            tokenGenerationTime: time.now()
                        });
                        newAuthToken.save((err, newTokenDetails) => {
                            if (err) {
                                logger.error(err.message, 'userController : saveToken', 10);
                                let apiResponse = response.generate(true, 'Failed to generate token', 500, 10);
                                reject(apiResponse);
                            } else {
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody);
                            }
                        })
                    } else {
                        //console.log('already exist auth token')
                        retrievedTokenDetails.authToken = tokenDetails.token;
                        retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                        retrievedTokenDetails.tokenGenerationTime = time.now();
                        retrievedTokenDetails.save((err, newTokenDetails) => {
                            if (err) {
                                //console.log(err);
                                logger.error(err.message, 'userController : saveToken', 10)
                                let apiResponse = response.generate(true, 'Failed to generate token', 500, 10);
                                reject(apiResponse);
                            } else {
                                //console.log(newTokenDetails)
                                let responseBody = {
                                    authToken: newTokenDetails.authToken,
                                    userDetails: tokenDetails.userDetails
                                }
                                resolve(responseBody);
                            }
                        })
                    }
                })
        });
    }; //end of saveToken method


    getUser(req, res)
        .then(findAndSaveUser)
        .then(createToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            //console.log("errorhandler");
            //console.log(err);
            res.status(err.status)
            res.send(err)
        });
    // findUser(req, res)
    //     .then(validatePassword)
    //     .then(generateToken)
    //     .then(saveToken)
    //     .then((resolve) => {
    //         let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
    //         res.status(200)
    //         res.send(apiResponse)
    //     })
    //     .catch((err) => {
    //         //console.log("errorhandler");
    //         //console.log(err);
    //         res.status(err.status)
    //         res.send(err)
    //     });
}; //end of loginFunction

let getAllUsersFunction = (req, res) => {
    UserModel.find()
        .select('userId name')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err, 'userController : getAllUserFunction', 10);
                let apiResponse = response.generate(true, err, 400, null);
                res.send(apiResponse)
            } else if (!result) {
                let apiResponse = response.generate(false, 'No data found', 204, null);
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Users data found successfully', 200, result);
                res.send(apiResponse)
            }
        })
}; //end of getAllUserFunction
let createIssueFunction = (req, res) => {
    console.log('req.body')
    console.log(req.body)

    console.log('req.files')
    console.log(req.files)
    let checkParameters = (req, res) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.title) || check.isEmpty(req.body.description) || check.isEmpty(req.body.assignee)) {
                logger.error('1 or more parameters are missing', 'userController:createIssueFunction=>checkParameters', 8);
                let apiResponse = response.generate(true, '1 or more parameters are missing', 400, null);
                reject(apiResponse);
            } else {
                console.log('it is done')
                resolve(req);
            }
        });
    }; //end of checkParameters

    let saveData = (req) => {
        console.log('req')
        console.log(req.files)
        return new Promise((resolve, reject) => {
            let d = [];
            req.files.forEach(element => {
                d.push(element.filename);
            });
            console.log('d');
            console.log(d);
            let issueData = new IssueModel({
                issueId: shortid.generate(),
                title: req.body.title.trim(),
                description: req.body.description.trim(),
                attachment: d,
                assignedTo: req.body.assignee,
                createdBy: req.body.createdBy,
                createdOn: time.getLocalTime(),
                lastModifiedOn: time.getLocalTime()
            });
            console.log('issueData')
            console.log(issueData)

            //save to db
            issueData.save((err, generatedToDoItem) => {
                if (err) {
                    //console.log(err)
                    logger.error(err.message, 'userController:createIssueFunction=>saveData', 10);
                    let apiResponse = response.generate(true, 'Unable to create new issue', 400, null);
                    reject(apiResponse);
                } else {
                    let generatedToDoItemObject = generatedToDoItem.toObject();
                    resolve(generatedToDoItemObject);
                }
            });
        });
    }; //end of saveData
    checkParameters(req, res)
        .then(saveData)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Issue created successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err, 'While saving issue', 10);
            res.status(err.status)
            res.send(err)
        });
}; //end of create issue function

let getAllReq = (req, res) => {
    console.log(req.body);
    let perPage = req.body.length;
    let page = req.body.length * req.body.start;
    // creating find query.

    findQuery = {};
    populate = { 'path': 'assignedTo' };
    orderColumn = req.body.order[0].column;
    dir = req.body.order[0].dir;

    if (orderColumn === 0) {
        orderColumn = 'title';
    } else if (orderColumn === 1) {
        sort = {}
        populate = { 'path': 'assignedTo', 'select': 'name', 'sort': { 'name': dir } }
    } else if (orderColumn === 2) {
        orderColumn = 'createdOn';
    } else if (orderColumn === 3) {
        orderColumn = 'status'
    }

    console.log('populate')
    console.log(populate)
    if (orderColumn != 1) {
        sort = {
            [orderColumn]: dir
        };
    }
    console.log(sort);
    if (!check.isEmpty(req.body.search.value)) {
        findQuery = {
            $or: [
                { 'title': { '$regex': req.body.search.value, '$options': 'i' } },
                { 'status': { '$regex': req.body.search.value, '$options': 'i' } }
            ]
        };
    }

    IssueModel.count(findQuery, (err, count) => {
        IssueModel.find(findQuery)
            .select('status title assignedTo createdOn')
            .populate(populate)
            .sort(sort)
            .limit(perPage)
            .skip(req.body.start)
            .lean()
            .exec((err, result) => {
                if (!err) {
                    dataa = [];
                    result.forEach(element => {
                        element.assignedTo = element.assignedTo.name;
                    });
                    let objToSend = {
                        draw: 0,
                        recordsTotal: count,
                        recordsFiltered: count,
                        data: result
                    };
                    console.log(objToSend)
                    res.status(200);
                    res.send(objToSend);
                }
            })
    })
};
module.exports = {
    loginFunction: loginFunction,
    signInSocial: loginFunction,
    getAllUsers: getAllUsersFunction,
    createIssue: createIssueFunction,
    getAllReq: getAllReq
};