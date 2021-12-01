const readline = require("readline");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require('path');
const { RSA_PKCS1_PADDING } = require("constants");

const port = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname,'./client/build')))


const server = http.createServer(app);

const io = socketIo(server);


let SocketStack = []

let chatRooms = []

let userCount = 0;
let roomNumber = 0;



io.on('connection', socket => {  
    console.log("New User")
    SocketStack.push(socket)
    let currRoom;

    socket.on('LogIn', (callback) =>  {
        userCount++;
        console.log(userCount)
        if(chatRooms.length === 0){
            chatRooms.push(new Array())
        }

        if(userCount % 3 === 0){
            roomNumber++;
            console.log("New Room Created")
            chatRooms.push(new Array())
        }

        currRoom = roomNumber;

        socket.join(currRoom.toString())

        callback({
            roomNum: currRoom,
            messages: chatRooms[currRoom]
        })
    });

    socket.on('SendMessage', (message) => {
        console.log("sending new message")
        chatRooms[currRoom].push(message)
        
        io.sockets.to(currRoom.toString()).emit('NewMessage', message)
    });

    socket.on('disconnect', () => {
        console.log("disconnecting a user")
        if(!userCount < 1){
            userCount--;
        }
        console.log(userCount)
        socket.disconnect(true);
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



