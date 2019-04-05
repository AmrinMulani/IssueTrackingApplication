const mongoose = require('mongoose')
const FriendListModel = mongoose.model('Friend');

let getAllFriendsId = (userId, cb) => {
    FriendListModel.find({ $or: [{ userId: userId }, { sentTo: userId }], status: 'Completed' })
        .populate('sentTo userId')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                cb(err, null)
            }
            if (result) {
                // console.log('result')
                // console.log(result)
                cb(null, result);
            }
        })
};

module.exports = {
    getAllFriendsId: getAllFriendsId
};