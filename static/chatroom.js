import { io } from "socket.io-client";

console.log('chatroom js connected')

const URL = "http://localhost:8000";
const socket = io(URL + '/', { autoConnect: true });

const send_btn = document.querySelector("#send_btn")
console.log(send_btn)
send_btn.addEventListener("click", ()=> {
    message_typing_area = document.querySelector("#message_typing_area")
    message = message_typing_area.value;
    if (message.length > 0) {

    }
    message_typing_area.value = "";
})