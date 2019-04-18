const mongoose = require('mongoose')
const IssueModel = mongoose.model('Issue');

const WatcherModel = mongoose.model('Watcher');

// let test = (userId, cb) => {
//     FriendListModel.find({ $or: [{ userId: userId }, { sentTo: userId }], status: 'Completed' })
//         .populate('sentTo userId')
//         .lean()
//         .exec((err, result) => {
//             if (err) {
//                 console.log(err)
//                 cb(err, null)
//             }
//             if (result) {
//                 // console.log('result')
//                 // console.log(result)
//                 cb(null, result);
//             }
//         })
// };
let getAllFriendsId = (id, cb) => {
    IssueModel.find({
            $or: [
                { assignedTo: id },
                { createdBy: id }
            ]
        })
        .select().lean()
        .exec((err, result) => {
            WatcherModel.find({ watcherId: id })
                .select().lean().exec((e, watch) => {
                    var issueData = [];
                    result.forEach(d => {
                        issueData.push(d.issueId);
                    });

                    watch.forEach(d => {
                        issueData.push(d.issueId);
                    })

                    let unique = [...new Set(issueData)];
                    cb(null, unique);
                });
        });

    // FriendListModel.find({ $or: [{ userId: userId }, { sentTo: userId }], status: 'Completed' })
    //     .populate('sentTo userId')
    //     .lean()
    //     .exec((err, result) => {
    //         if (err) {
    //             console.log(err)
    //             cb(err, null)
    //         }
    //         if (result) {
    //             // console.log('result')
    //             // console.log(result)
    //             cb(null, result);
    //         }
    //     })
};

module.exports = {
    getAllFriendsId: getAllFriendsId
        // ,
        // test: test
};