
let socket = io();
document.getElementById("login-form").style.display = "none";
document.getElementById("room-info").style.display = "none";


socket.on("connect", () => {
    socket.on("waiting-for-input", () => {
        document.getElementById("login-form").style.display = "";
        document.getElementById("join-button").addEventListener("click", joinRoom)
        document.getElementById("create-button").addEventListener("click", newRoom)
        document.getElementById("connecting").style.display = "none";
    })
    socket.on("joined-room-succesfully", () => {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("room-info").style.display = "";
    })
    socket.on("participants-list-refresh", (input) => {
        let list = document.getElementById("participants-list")
        let roomName = document.getElementById("room-txt")
    
        list.innerHTML = "";
        roomName.innerText = `${input.roomID}`
    
        let participants = input.participants;
        participants.forEach(prtcpnt => {
            let listItem = document.createElement("li");
            listItem.appendChild(document.createTextNode(prtcpnt.username));
            if (prtcpnt.sid == input.adminSID) {
                listItem.appendChild(document.createTextNode(" 🗝️"));
            }
            list.appendChild(listItem);
        });
    })
    
    socket.on("disconnect", () => {

    })
    
})

function joinRoom() {
    let name = document.getElementById("username-input").value
    let room = document.getElementById("room-input").value
    let output = { desiredUsername: name, desiredRoom: room };
    socket.emit("join-room", output);
}
function newRoom() {
    let name = document.getElementById("username-input").value
    let output = { desiredUsername: name };
    socket.emit("create-new-room", output);
}