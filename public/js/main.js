const URL = "http://localhost:8000";
const socket = io(URL + '/', { autoConnect: true });

const EMAIL = 'email'
const PW = 'password'
const ROLE = 'role'
const STUDENT = 'student'
const PROFESSOR = 'professor'
const TYPE = 'type'
const AREA = 'area'
const SUBJECT = 'subject'
const ROOM_NAME = 'room_name'

let user = JSON.parse(sessionStorage.getItem('user'))
let user_email = user.EMAIL
let user_role = user.ROLE
let user_chatroom = user.CHATROOM

// console.log("Object.keys(user_chatroom):\n" + Object.keys(user_chatroom))
for (let room_name in user_chatroom) {
    // console.log(room_name)
    console.log(user_chatroom)
    let parent
    let type = user_chatroom[room_name].TYPE
    // console.log("type:\n" + type)
    let new_chatroom = document.createElement("button")
    new_chatroom.className = "list-group-item list-group-item-action chatroom_btn"
    new_chatroom.textContent = room_name
    new_chatroom.addEventListener("click", (evt) => {
        evt.preventDefault()

        let data = {
            EMAIL : user_email,
            ROOM_NAME : room_name
        }
        fetch("/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
        .then((data) => {
            // console.log('data:\n' + JSON.stringify(data))
            sessionStorage.setItem("chatdata", JSON.stringify(data))
            window.location.replace(URL + '/chat')
            
        })
    })
    if (type === AREA) {
        parent = document.querySelector("#type_area")
    }
    else if (type === SUBJECT) {
        parent = document.querySelector("#type_subject")
    }
    parent.appendChild(new_chatroom)
}

const join_btn = document.querySelector("#join_btn")
join_btn.addEventListener("click", (evt)=> {

    evt.preventDefault()
    
    let user = JSON.parse(sessionStorage.getItem('user'))
    let user_email = user.EMAIL
    let user_role = user.ROLE
    let user_chatroom = user.CHATROOM
    let chat_room_code = document.querySelector("#chat_room_code").value
    if (chat_room_code.length === 0) {
        alert('Please input chatroom code!')
    }
    else {

        data =  {
            CODE : chat_room_code,
            EMAIL : user_email,
            ROLE: user_role,
        }
        console.log(data)
    
        fetch('/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data.STATUS : ' + data.STATUS)
            if (data.STATUS === 200) {
                user_info = sessionStorage.getItem('user')
                let user = JSON.parse(sessionStorage.getItem('user'))
                user.CHATROOM = data.VALUE
                console.log('data.VALUE:\n' + data.VALUE)
                sessionStorage.setItem('user', JSON.stringify(user))
                window.location.replace(URL + '/main')
            }
            else {
                alert('Code is wrong, or you are already joined the chatroom!')
            }
        });
        }
    }
)

