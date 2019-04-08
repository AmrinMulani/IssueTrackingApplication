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

var fs = require('fs');
const path = require('path');


/* Models */

const IssueModel = mongoose.model('Issue');


let getIssuesReporterWise = (req, res) => {
    //console.log(req.body);
    // console.log(req.params);
    let perPage = req.body.length;
    let page = req.body.length * req.body.start;
    // creating find query.

    findQuery = { 'assignedTo': req.params.assignedTo };
    populate = { 'path': 'createdBy' };
    orderColumn = req.body.order[0].column;
    dir = req.body.order[0].dir;

    if (orderColumn === 0) {
        orderColumn = 'title';
    } else if (orderColumn === 1) {
        sort = {}
        populate = { 'path': 'createdBy', 'select': 'name', 'sort': { 'name': dir } }
    } else if (orderColumn === 2) {
        orderColumn = 'createdOn';
    } else if (orderColumn === 3) {
        orderColumn = 'status'
    }

    if (orderColumn != 1) {
        sort = {
            [orderColumn]: dir
        };
    }
    console.log(sort);
    if (!check.isEmpty(req.body.search.value)) {
        findQuery = {
            $and: [
                { 'assignedTo': req.params.assignedTo }
            ],
            $or: [
                { 'title': { '$regex': req.body.search.value, '$options': 'i' } },
                { 'status': { '$regex': req.body.search.value, '$options': 'i' } }
            ]
        };
    }

    console.log('findQuery')
    console.log(findQuery)
    IssueModel.count(findQuery, (err, count) => {
        IssueModel.find(findQuery)
            .select('issueId status title createdBy createdOn')
            .populate(populate)
            .sort(sort)
            .limit(perPage)
            .skip(req.body.start)
            .lean()
            .exec((err, result) => {
                if (!err) {
                    dataa = [];
                    result.forEach(element => {
                        element.createdBy = titleCase(element.createdBy.name);
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
            });
    });
}; //end of getIssuesReporterWise

let viewByIssueId = (req, res) => {

    let validateInput = (req, res) => {
        return new Promise((resolve, reject) => {
            if (!check.isEmpty(req.params.issueId)) {

                IssueModel.findOne({ 'issueId': req.params.issueId })
                    .populate('assignedTo')
                    .populate('createdBy')
                    .exec((err, result) => {
                        if (err) {
                            logger.error(err, 'issueController: viewByIssueId => validateInput', 10);
                            let apiResponse = response.generate(true, err, 500, null);
                            reject(apiResponse);
                        } else if (check.isEmpty(result)) {
                            logger.info('No data found', 'issueController: viewByIssueId => validateInput');
                            let apiResponse = response.generate(false, 'No data found', 204, null);
                            reject(apiResponse);
                        } else {
                            resolve(result);
                        }

                    });
            } else {
                logger.error('Issue id is missing in the request', 'issueController: viewByIssueId => validateInput', 10);
                let apiResponse = response.generate(true, 'Issue is is missing in the request', 400, null);
                reject(apiResponse);
            }
        });
    }; //end of validateInput

    validateInput(req, res)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Data Found', 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            logger.error(err, 'While fetching issue', 10);
            res.send(err)
        });
}; //end of viewByIssueId

let deletePhoto = (req, res) => {

    //to validate if exists => issue id and photo url in the req
    let validateParameters = (req, res) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.query.issueId)) {
                logger.error('Issue id is missing in the request', 'issueController : DeletePhoto=> validateParameters', 10);
                let apiResponse = response.generate(true, 'Issue id is missing in the request', 400, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.query.photo)) {
                logger.error('photo url is missing in the request', 'issueController : DeletePhoto=> validateParameters', 10);
                let apiResponse = response.generate(true, 'photo url is missing in the request', 400, null);
                reject(apiResponse);
            } else {
                resolve(req);
            }
        });
    }; //end of validateParameters

    let findAndDeletePhoto = (req) => {
        return new Promise((resolve, reject) => {
            IssueModel.findOne({ 'issueId': req.query.issueId })
                .exec((err, result) => {
                    if (err) {
                        logger.error(err, 'issueController : DeletePhoto=> findAndDeletePhoto', 10);
                        let apiResponse = response.generate(true, err, 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        logger.error('No record found for the id', 'issueController : DeletePhoto=> findAndDeletePhoto', 10);
                        let apiResponse = response.generate(true, 'No record found for the id', 204, null);
                        reject(apiResponse);
                    } else {
                        let attachments = result.attachment;
                        let index = attachments.findIndex(x => x == req.query.photo);
                        console.log('\n\n\n\n\n\n\n\n\n\n\n\n' + index)
                        attachments.splice(index, 1);

                        result.markModified('attachment');
                        result.save((err, newData) => {
                            if (err) {
                                //console.log(err)
                                logger.error(err.message, 'issueController: DeletePhoto => findAndDeletePhoto', 10);
                                let apiResponse = response.generate(true, 'Unable to delete photo', 400, null);
                                reject(apiResponse);
                            } else {

                                let dirName = path.join(__dirname, '../../uploads')
                                var filePath = `${dirName}/${req.query.photo}`;
                                fs.unlinkSync(filePath);
                                let newDataObject = newData.toObject();
                                resolve(newDataObject);
                            }
                        });
                    };
                });
        });
    }; //end of find and deletephoto

    validateParameters(req, res)
        .then(findAndDeletePhoto)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'deleted successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.status(err.status)
            res.send(err)
        });
}; //end of deletePhoto
module.exports = {
    getIssuesReporterWise: getIssuesReporterWise,
    viewByIssueId: viewByIssueId,
    deletePhoto: deletePhoto
}