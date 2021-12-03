const readline = require("readline");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const { RSA_PKCS1_PADDING, SSL_OP_EPHEMERAL_RSA } = require("constants");
const { access } = require("fs");

const port = process.env.PORT || 80; //setting up the port to use

const app = express(); //creating the express server

app.use(express.static(path.join(__dirname,'./client/build'))) //setting the static path

const server = http.createServer(app);

const io = socketIo(server); 

let SocketStack = [] //intializing variables to use


let chatRooms = []

let userCount = 0;
let roomNumber = 0;


let isBeingChanged = 0;

function sleep(ms) { //wait for time
    console.log("waiting")
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeSharedMemory(type, operation, data){
    if(isBeingChanged === 1){
        let data;
        sleep(200).then(
            data = changeSharedMemory(type, operation, data)
        )
        return data;
    }
    else{
        isBeingChanged = 1;
        if(type === 'userCount'){
            if(operation === 'increment'){
                userCount++;
            }
            if(operation === 'decrement'){
                userCount--;
            }
            if(operation === 'read'){
                isBeingChanged = 0;
                return userCount;
            }
        }
        if(type === 'roomNumber'){
            if(operation === 'increment'){
                roomNumber++;
            }
            if(operation === 'decrement'){
                roomNumber--;
            }
            if(operation === 'read'){
                isBeingChanged = 0;
                return roomNumber;
            }
        }
        if(type === 'chatRooms'){
            if(operation === 'length'){
                isBeingChanged = 0;
                return chatRooms.length
            }
            if(operation === 'push'){
                chatRooms.push(data)
            }
            if(operation === 'NewMessage'){
                chatRooms[data.index].push(data.message)
            }
            if(operation === 'read'){
                isBeingChanged = 0;
                return chatRooms[data]
            }

        }
        isBeingChanged = 0;
    }
}



io.on('connection', socket => {  //intializing the server
    console.log("New User")
    SocketStack.push(socket) //push new socket into the stack
    let currRoom;

    socket.on('LogIn', (callback) =>  { //setting up the socket for when someone log into the app
        console.log("logged in")
        changeSharedMemory('userCount', 'increment', null)
        if(changeSharedMemory('chatRooms', 'length', null) === 0){ //when no rooms are open an array is added to the chatRooms array
            changeSharedMemory('chatRooms', 'push',new Array())
        }

        if(changeSharedMemory('userCount', 'read', null) % 3 === 0){ //when 2 people enter the room it is considered full and will instead create a new room to push to the chatRooms array
            changeSharedMemory('roomNumber', 'increment', null);
            changeSharedMemory('chatRooms', 'push',new Array())
        }

        currRoom = changeSharedMemory('roomNumber', 'read', null); 

        socket.join(currRoom.toString()) //join the current room to the socket

        console.log(changeSharedMemory('userCount', 'read', null))

        callback({ //return value for login function, initializes the messages for a client so they can seee history
            roomNum: currRoom,
            messages: changeSharedMemory('chatRooms', 'read', [currRoom])
        })
    });

    socket.on('SendMessage', (message) => { //setting up socket for when someone sends a message in the app
        changeSharedMemory('chatRooms', 'NewMessage', {index: currRoom, message: message})
        
        io.sockets.to(currRoom.toString()).emit('NewMessage', message) //sends message to the current specific room
    });

    socket.on('disconnect', () => { //setting up socket for when someone disconnects
        console.log("disconnecting user " + socket.id)
        if(!changeSharedMemory('userCount', 'read', null) < 1){ //decrease user count when someone begins disconnecting
            changeSharedMemory('userCount', 'decrement', null);
        }
        socket.disconnect(true); //disconnect the user socket
    })
})

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
};
  
(async () => {
    //start server and wait for input, 
    server.listen(port, () => {
        console.log(`Listening on port ${port}, press any key to stop`)  
    });

    await keypress()
    
    console.log("closing server and killing sockets")

    //on close disconnect all sockets from server
    for(let i = 0; i < SocketStack.length; i ++){
        SocketStack[i].disconnect(true);
    }

    console.log('bye')
  
})().then(process.exit)


