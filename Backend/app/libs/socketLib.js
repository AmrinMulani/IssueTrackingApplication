/*
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib');
const check = require('./checkLib');
const response = require('./responseLib');

const time = require('./timeLib');

const NotificationModel = mongoose.model('Notification');

const redisLib = require('./redisLib')
const friendLib = require('./friendListLib')

var dataSS = [];

const allUsers = [];

var rooms = [];
let setServer = (server) => {
    console.log('socketServer called');
    let io = socketio.listen(server);
    let myIo = io.of('/chat');

    myIo.on('connection', (socket) => {
        rooms = [];
        console.log("on connection emitting verify user");
        socket.emit("verifyUser", "");
        console.log('socket.userId')
        console.log(socket.userId)

        //code to verify the user and make him online
        socket.on('set-user', (authToken) => {
                console.log("set-user called")
                tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                    if (err) {
                        socket.emit('auth-error', {
                            status: 500,
                            error: 'Please provide valid auth token'
                        })
                    } else {
                        console.log('user is verified, setting details');
                        let currentUser = user.data;

                        //setting socket user id
                        socket.userId = currentUser.userId
                        let fullName = `${currentUser.firstName} ${currentUser.lastName}`;


                        //let key = currentUser.userId;
                        let value = fullName;
                        let key = currentUser._id + "Room";
                        // let setUserOnline = redisLib.setANewOnlineUserInHash("rooms", key, value, (err, result) => {
                        //     if (err) {
                        //         console.log("some error occurred")
                        //     } else {
                        //         //setting room name
                        //         socket.room = key;
                        //         //joining chat-group room.
                        //         socket.join(socket.room);
                        //     }
                        // });

                        if (rooms.indexOf(key) < 0)
                            rooms.push(key)


                        friendLib.getAllFriendsId(currentUser._id, (err, result) => {
                            if (err) {
                                socket.emit('auth-error', {
                                    status: 500,
                                    error: 'Please provide valid auth token'
                                })
                            } else {
                                // console.log('result')
                                // console.log(result)

                                result.forEach(element => {
                                    let room = '';
                                    currentUser._id === element.userId._id ? room = element.sentTo._id + 'Room' : room = element.userId._id + 'Room'

                                    var index = rooms.indexOf(room);
                                    if (index < 0)
                                        rooms.push(room)
                                        // socket.room = key;
                                        // socket.join(room);
                                });

                                createRoom();
                            }
                        });

                        createRoom = () => {
                                console.log('inside rooms array')
                                console.log(rooms)
                                for (room in rooms) {
                                    socket.room = rooms[room];
                                    socket.join(rooms[room])
                                }
                                setTimeout(function() {
                                    console.log('socket room')
                                    console.log(socket.rooms)
                                }, 2000)
                            }
                            // socket.to(socket.room)
                            //     .broadcast.emit('online-user-list', result);
                    }
                })
            }) // end of listening set-user event

        socket.on('disconnect', () => {

                console.log('user is disconnected');
                console.log(socket.userId);

                var removeIndex = allUsers.map(function(item) {
                    return item.userId;
                }).indexOf(socket.userId);

                var remIndex = allUsers.indexOf(socket.userId)
                console.log('removeIndex')
                console.log(remIndex)

                allUsers.splice(remIndex, 1);
                console.log('allUsers');
                console.log(allUsers);
                if (socket.userId) {
                    socket.leaveAll();
                    //socket.leave(socket.room);
                    //socket.to(socket.room).broadcast.emit('online-user-list', result);
                }



            }) //end of on disconnect

        socket.on('send-request', (data) => {
            // console.log('SEND-REQUEST DATA')
            // console.log(data)
            // console.log('socket.room DATA')

            let roomName = data.createdBy + 'Room';
            console.log('roomName')
            console.log(roomName)

            // socket.to(`'${roomName}'`)
            // socket.to(roomName)

            // var clients = myIo.clients(roomName); // all users from room `room`
            // console.log('clients')
            // console.log(clients)

            // io.of('/chat').clients((error, clients) => {
            //     if (error) throw error;
            //     console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
            // });
            socket.to(roomName)
                .broadcast.emit('multi-todo-transaction', data.remarks);
        })
        socket.on('friend-request', (data) => {
            console.log("socket friend-request called")
            let newData = {
                notificationId: shortid.generate(),
                senderId: data.userId_id,
                receiverId: data.sentTo_id,
                message: `You've received a friend request from ${data.senderName}`,
                createdOn: time.now()
            };

            console.log(newData)
                // event to save chat.
            setTimeout(function() {
                eventEmitter.emit('save-request', newData);
            }, 2000)

            console.log('noti');
            console.log(newData);
            myIo.emit(data.sentTo_id, newData)
        })

        socket.on('typing', (fullName) => {
            socket.to(socket.room).broadcast.emit('typing', fullName);
        })
    });
}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-request', (data) => {

    let notificationObj = new NotificationModel(data);
    notificationObj.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        } else if (result === undefined || result === null || result === "") {
            console.log("Notification is not saved.");
        } else {
            console.log("notification saved.");
            console.log(result);
            dataSS = result;
        }
    });
}); // end of saving notifications.

module.exports = {
    setServer: setServer
}