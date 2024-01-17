const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
// const { io } = require("socket.io-client");
const { newParticipant } = require("./classes/participant")
const { roomManager } = require("./classes/roomManager");

const publicPath = path.join(__dirname, "/../public/");
const address = '192.168.1.120' //'10.0.0.1'
const port = process.env.PORT || 3000;

let app = express()
let server = http.createServer(app)
let io = socketIO(server)
app.use(express.static(publicPath));

io.on("connection", (socket) => {
    socket.data.participant = newParticipant({sid: socket.id})
    io.to(`${socket.data.participant.sid}`).emit("waiting-for-input");

    socket.on("join-room", (input) => {
        if (!input) return;
        for (const property in input) {
            if (!input[property]) return;
          }

        joinRoomHandler(socket, input);
    })
    socket.on("create-new-room", (input) => {
        if (!input) return;
        for (const property in input) {
            if (!input[property]) return;
          }
        
        createRoomHandler(socket, input);
    })
    socket.on("disconnect", () => {
        if (!socket.data.participant.username) return;
        leaveRoomHandler(socket);
    })
})

server.listen(port,address, () => {
    console.log(`click here: http://${address}:${port}/`);
})

function emitParticipants(roomObj) {
    let [admin] = roomObj.participants
    io.to(roomObj.name).emit("participants-list-refresh",
    {
        roomID: roomObj.name,
        adminSID: admin.sid,
        participants: roomObj.getParticipants()
    })
};

function joinRoomHandler(socket, input){

    if (socket.data.participant.room != undefined) return;

    let roomObj = roomManager.attempt(input.desiredRoom);
    if (roomObj == null) {
        io.to(`${socket.data.participant.sid}`).emit("no-room-found");
        return;
    }

    socket.data.participant.username = input.desiredUsername;
    socket.data.participant.room = roomObj;
    socket.join(socket.data.participant.room .name);
    roomObj.addParticipant(socket.data.participant);
    io.to(`${socket.data.participant.sid}`).emit("joined-room-succesfully");

    emitParticipants(roomObj);
}

async function createRoomHandler(socket, input){

    if (socket.data.participant.room != undefined) return;

    let roomObj = roomManager.createNewRoom();

    if (roomObj == null) {
        io.to(`${socket.data.participant.sid}`).emit("no-room-found");
        return;
    }

    socket.data.participant.username = input.desiredUsername;
    socket.data.participant.room = roomObj;
    await socket.join(roomObj.name);
    await roomObj.addParticipant(socket.data.participant);

    io.to(`${socket.data.participant.sid}`).emit("joined-room-succesfully");
    
    emitParticipants(roomObj);
}

function leaveRoomHandler(socket){
    let roomObj = socket.data.participant.room;
    roomObj.removeParticipant(socket.data.participant.sid);

    if (roomObj.participants.size === 0 ){
        roomManager.removeRoom(roomObj.name);
        return;
    }

    emitParticipants(roomObj);
}