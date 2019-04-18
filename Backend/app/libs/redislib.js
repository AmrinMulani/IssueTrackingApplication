const mongoose = require('mongoose');
const check = require("./checkLib.js")
const SocketModel = mongoose.model('Socket');
//let client = redis.createClient();
const logger = require('./loggerLib')
let redis = require('redis'),
    /* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
    client = redis.createClient({
        port: 12264, // replace with your port
        host: 'redis-12264.c1.asia-northeast1-1.gce.cloud.redislabs.com', // replace with your hostanme or IP address
        password: 'Himanshu@123'
    });
client.on('connect', () => {
    console.log("redis connection successfully opened");
});

let getAllUsersInAHash = (hashName, callback) => {
    client.HGETALL(hashName, (err, result) => {
        // console.log(`getting all online users for hash ${hashName}`)

        if (err) {
            console.log(err);
            callback(err, null);
        } else if (check.isEmpty(result)) {
            // console.log("online user list is empty")
            // console.log(result)
            callback(null, {});
        } else {
            // console.log(result);
            callback(null, result);
        }

    })
}

// function to set new online user
let setANewOnlineUserInHash = (hashName, key, value, callback) => {
    console.log(`setting user ${key} with value in hash ${hashName}`);

    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {
            console.log(err)
            callback(err, null);
        } else {
            console.log("user has been set in the hash map");
            console.log(result);
            callback(null, result);
        }
    })
} // end set a new online user in hash
let getASingleDataFromHash = (hashName, key, callback) => {
    client.HGET(hashName, key, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else if (check.isEmpty(result)) {
            // console.log('redis line 59')
            // console.log(result)
            callback(null, null);
        } else {
            // console.log('redis line 63')
            // console.log(result);
            callback(null, result);
        }

    })
}
let deleteUserFromHash = (hashName, key) => {
    client.HDEL(hashName, key);
}

let getAllUsers = (roomName, userId, cb) => {
    SocketModel.findOne({ 'roomName': roomName }, (err, retrievedSocket) => {
        if (err) {
            cb(err, null)
        } else if (retrievedSocket) {
            let socketData = retrievedSocket.data;

            let checkByUserId = socketData.find(x => x.userId === userId);

            if (!checkByUserId) {
                let remData = socketData.filter(x => x.userId === userId);
                retrievedSocket.data = remData;

                retrievedSocket.save((err, updated) => {
                    if (err)
                        cb(err + 'unable to delete old id from server', null)
                    if (updated)
                        cb(null, checkByUserId);
                })
            } else
                cb('no data found for the user id', null)

        }
    });
};//
let setupNewRoom = (roomName, userId, socketId, cb) => {

    // logger.error(roomName, userId, socketId);
    SocketModel.findOne({ 'roomName': roomName }, (err, result) => {
        if (err) {
            console.log('error hai')
            console.log(err)
            cb(err, null)
        } else if (!check.isEmpty(result)) {
            // logger.error(result, '', 10);
            let newObj = {
                userId: userId,
                socketId: socketId
            };
            oldData = result.data;
            let exist = oldData.find(x => x.userId === userId);

            if (exist) {
                cb(null, {})
            } else {
                result.data.push(newObj);
                result.save((err, resp) => {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, resp)
                    }
                })
            }
        } else {
            let newObj = new SocketModel({
                roomName: roomName,
                data: {
                    userId: userId,
                    socketId: socketId
                }
            });
            newObj.save((err, res) => {
                if (err)
                    cb(err, null)
                else if (!res)
                    cb(null, null)
                else {
                    cb(null, res.toObject());
                }
            })
        }
    });
}
module.exports = {
    getAllUsersInAHash: getAllUsersInAHash,
    setANewOnlineUserInHash: setANewOnlineUserInHash,
    deleteUserFromHash: deleteUserFromHash,
    getASingleDataFromHash: getASingleDataFromHash,
    setupNewRoom: setupNewRoom,
    getAllUsers: getAllUsers
}