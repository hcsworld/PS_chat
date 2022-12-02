const EMAIL = 'email'
const PW = 'password'
const ROLE = 'role'
const STUDENT = 'student'
const PROFESSOR = 'professor'
const ID_NUM = 'id_num'
const MESSAGE_DATA = 'message_data'
const TYPE = 'type'
const AREA = 'area'
const SUBJECT = 'subject'
const STATUS = 'status'
const ROOM_NAME = 'room_name'

const URL = "http://localhost:8000";
const socket = io(URL + '/', { autoConnect: true });

update_chat()


const send_btn = document.querySelector("#send_btn")
console.log(send_btn)
send_btn.addEventListener("click", ()=> {
    message_typing_area = document.querySelector("#message_typing_area")
    message = message_typing_area.value;
    if (message.length > 0) {
        socket.emit("hello", message)
        socket.to()
    }
    message_typing_area.value = "";
})

function update_chat() {
    let chat_meta_data = sessionStorage['chatdata']
    let user_id_num = chat_meta_data.ID_NUM
    let user_role = chat_meta_data.ROLE
    let chat_data = chat_meta_data.CHAT_DATA
    
    for (idx in chat_data) {
        let chat = chat_data[idx]
        let role = chat.ROLE
        let id_num = chat.ID_NUM

        let message = chat.MESSAGE_DATA
        let parent = document.querySelector("#message_box")

        let message_container = document.createElement("div")
        message_container.className = "m-3 flex-column"
        let user_name = document.createElement("div")
        let chat_message = document.createElement("div")

        chat_message.textContent = message
        chat_message.style.display = 'inline-block'
        if (id_num === user_id_num && user_role == role) {
            user_name.textContent = "나"
            message_container.style.float = 'right'
            chat_message.className = 'mt-1 bg-success bg-opacity-50 p-2 rounded-2'
        }
        else if (role === PROFESSOR) {
            user_name.textContent = "교수 " + id_num
            chat_message.className = 'mt-1 bg-success bg-opacity-10 p-2 rounded-2'
        }
        else {
            user_name.textContent = "학생 " + id_num
            chat_message.className = 'mt-1 bg-success bg-opacity-10 p-2 rounded-2'
        }

        message_container.appendChild(user_name)
        message_container.appendChild(chat_message)
        parent.appendChild(message_container)

    }
}