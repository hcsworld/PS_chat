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
send_btn.addEventListener("click", ()=> {
    let chat_meta_data = JSON.parse(sessionStorage['chatdata'])
    let user_id_num = chat_meta_data.ID_NUM
    let user_role = chat_meta_data.ROLE
    let room_name= chat_meta_data.ROOM_NAME
    let chat_data = chat_meta_data.CHAT_DATA
    // console.log('user_id_num:' + user_id_num)
    // console.log('user_role:' + user_role)
    // console.log('room_name:' + room_name)
    // console.log('chat_data:' + JSON.stringify(chat_data))
    message_typing_area = document.querySelector("#message_typing_area")
    message = message_typing_area.value;
    if (message.length > 0) {
        socket.emit("chat", {
                ROOM_NAME: room_name,
                ID_NUM: user_id_num,
                ROLE: user_role,
                MESSAGE: message,
            })
    }
    message_typing_area.value = "";
})

const exit_btn = document.querySelector("#exit_btn")
exit_btn.addEventListener("click", ()=> {
    let chat_meta_data = JSON.parse(sessionStorage['chatdata'])
    let room_name= chat_meta_data.ROOM_NAME
    let email = chat_meta_data.EMAIL

    let data = {
        EMAIL : email,
        ROOM_NAME : room_name
    }

    fetch("/exit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.json())
    .then((chatdata) => {
        let user_info = JSON.parse(sessionStorage['user'])
        user_info.CHAT_DATA = chatdata
        sessionStorage.setItem('user', JSON.stringify(chatdata))
        alert(room_name + '방을 나갔습니다.')
        window.location.replace(URL + '/main')
    })

})

socket.on("new_chat", (data) => {
    
    let received_room_name = data.ROOM_NAME
    let received_chat_data = data.CHAT_DATA
    
    let chat_meta_data = JSON.parse(sessionStorage['chatdata'])
    let cur_room_name= chat_meta_data.ROOM_NAME

    if (received_room_name === cur_room_name) {
        new_chat_data = JSON.parse(sessionStorage['chatdata'])
        new_chat_data.CHAT_DATA = received_chat_data
        sessionStorage.setItem('chatdata', JSON.stringify(new_chat_data))

        document.querySelector('#message_box').remove()
        message_box_parent = document.querySelector("#message_box_parent")
        new_message_box = document.createElement("div")
        new_message_box.className = "w-100 h-100 overflow-auto"
        new_message_box.id = "message_box"
        message_box_parent.appendChild(new_message_box)

        update_chat()
    }
})

function update_chat() {
    let chat_meta_data = JSON.parse(sessionStorage['chatdata'])
    let user_id_num = chat_meta_data.ID_NUM
    let user_role = chat_meta_data.ROLE
    let room_name= chat_meta_data.ROOM_NAME
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