const participantPrototype = {
    sid: undefined,
    username: undefined,
    room: undefined,
    setName: function(){

    },
    setRoom: function(){

    }
};

function newParticipant(participantObj) {
    if (!participantObj) return;

    const participant = Object.create(participantPrototype);
    participant.sid = participantObj.sid;
    return participant;
}

module.exports = { newParticipant }