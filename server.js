const readline = require("readline");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const { RSA_PKCS1_PADDING } = require("constants");

const port = process.env.PORT || 3001; //setting up the port to use

const app = express(); //creating the express server

app.use(express.static(path.join(__dirname,'./client/build'))) //setting the static path


const server = http.createServer(app);

const io = socketIo(server); 


let SocketStack = [] //intializing variables to use

let chatRooms = []

let userCount = 0;
let roomNumber = 0;



io.on('connection', socket => {  //intializing the server
    console.log("New User")
    SocketStack.push(socket) //push new socket into the stack
    let currRoom;

    socket.on('LogIn', (callback) =>  { //setting up the socket for when someone log into the app
        userCount++; //increasing the amount of users active
        console.log(userCount)
        if(chatRooms.length === 0){ //when no rooms are open an array is added to the chatRooms array
            chatRooms.push(new Array())
        }

        if(userCount % 3 === 0){ //when 3 people enter the room it is considered full and will instead create a new room to push to the chatRooms array
            roomNumber++;
            console.log("New Room Created")
            chatRooms.push(new Array())
        }

        currRoom = roomNumber; 

        socket.join(currRoom.toString()) //join the current room to the socket

        callback({ //called once the other side acknowledges LogIn event
            roomNum: currRoom,
            messages: chatRooms[currRoom]
        })
    });

    socket.on('SendMessage', (message) => { //setting up socket for when someone sends a message in the app
        console.log("sending new message")
        chatRooms[currRoom].push(message) //client message is pushed to the chatroom
        
        io.sockets.to(currRoom.toString()).emit('NewMessage', message) //sends message to the current specific room
    });

    socket.on('disconnect', () => { //setting up socket for when someone disconnects
        console.log("disconnecting a user")
        if(!userCount < 1){ //decrease user count when someone begins disconnecting
            userCount--;
        }
        console.log(userCount)
        socket.disconnect(true); //disconnect the user socket
    })
})


function getInput(data) {
    var readLine1 = readline.createInterface({input: process.stdin, output: process.stdout});
    
    var promise = new Promise(input => {
            readLine1.question(data, response => {
                readLine1.close();
                input(response);
            })
        }
    )

    return promise;
  }



const serverProcess = server.listen(port, async () => {
    console.log(`Listening on port ${port}`)
    /*
    const ans = await getInput("Press any key to close the server");

    console.log("closing server and killing sockets")

    for(let i = 0; i < SocketStack.length; i ++){
        SocketStack[i].disconnect(true);
    }

    process.exit();
    */
});



