const check = require("./checkLib.js")

//let client = redis.createClient();

let redis = require('redis'),
    /* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
    client = redis.createClient({
        port: 19142, // replace with your port
        host: 'redis-19142.c1.asia-northeast1-1.gce.cloud.redislabs.com', // replace with your hostanme or IP address
        password: 'pP8WUSIjrsZnCx3H35zJtNH5SZQd3cj2'
    });
client.on('connect', () => {
    console.log("redis connection successfully opened");
});

let getAllUsersInAHash = (hashName, callback) => {
    client.HGETALL(hashName, (err, result) => {
        console.log(`getting all online users for hash ${hashName}`)

        if (err) {
            console.log(err);
            callback(err, null);
        } else if (check.isEmpty(result)) {
            console.log("online user list is empty")
            console.log(result)
            callback(null, {});
        } else {
            console.log(result);
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

let deleteUserFromHash = (hashName, key) => {
    client.HDEL(hashName, key);
}

module.exports = {
    getAllUsersInAHash: getAllUsersInAHash,
    setANewOnlineUserInHash: setANewOnlineUserInHash,
    deleteUserFromHash: deleteUserFromHash
}