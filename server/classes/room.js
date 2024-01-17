const roomPrototype = {
    name: null,         //string
    participants: null, //Set
    admin: null,        //string:PlayerID

    /**
    * Returns an array of current participant of this room
    * @returns {Array} An array of current participants refrences.
    */
    getParticipants: function () {
        let participantsArr = Array.from(this.participants);
        return participantsArr/** */.map(function(participant) { return {username: participant["username"], sid: participant["sid"]}});
    },

    /**
    * Adds a certain participant to this room
    * @param {Object} participant - participant object refrence for participant to be added.
    */
     addParticipant: async function (participant) {
        if (!participant) return;

        this.participants.add(participant)
        participant.room = this;
    },

    /**
    * Removes a certain participant (by SID) from this room
    * @param {String} sid - The SocketID of participant to be removed.
    */
    removeParticipant: function (sid) {
        if (!sid) return;
        this.participants.forEach((part) => {
            if (part.sid == sid) {
                this.participants.delete(part);
            }
        })
    },

    /**
    * Removes all  participants from this room
    */
    removeAllParticipants: function () {
        this.participants.forEach((part) => {
            this.participants.delete(part);
        })
    },

    getAdmin: function() {
        return this.participants[0].sid
    }
};

function newRoom(name) {
    const room = Object.create(roomPrototype);
    room.name = name;
    room.participants = new Set();

    return room;
}

module.exports = { newRoom }