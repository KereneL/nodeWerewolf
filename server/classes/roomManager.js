const { newRoom } = require("./room")

const roomManager = {
    rooms: new Map(),
    
    attempt: function (roomTxt) {
        if (this.rooms.has(roomTxt)) return this.rooms.get(roomTxt);
        else return this.roomNotFound()
    },

    roomNotFound: function () {
        return null;
    },

    createNewRoom: function () {
        let newRoomTxt = "";
        do {
            newRoomTxt = createRandomID();
            if (this.rooms.has(newRoomTxt)) newRoomTxt = "";
        } while (newRoomTxt == "")

        let roomObj = newRoom(newRoomTxt);
        this.rooms.set(newRoomTxt, roomObj)
        return roomObj;
    },

    removeRoom: function (roomTxt) {
        this.rooms.delete(roomTxt);
    },

    getAllRooms: function () {
        return Array.from(this.rooms);
    },

    getRoomParticipants: function (roomTxt){
        let room = this.attempt(roomTxt);
        if (room == null) return;
    }
}

const roomNameLength = 4;
function createRandomID() {
    let txt = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < roomNameLength) {
      txt += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return txt;
}


module.exports = { roomManager }