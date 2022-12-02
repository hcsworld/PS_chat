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
const CHATROOM = 'chatroom'
const STATUS = 'status'

const create_btn = document.querySelector("#create_btn")
create_btn.addEventListener("click", (evt)=> {

    evt.preventDefault()
    let user = JSON.parse(sessionStorage.getItem('user'))
    let user_email = user.EMAIL
    let user_role = user.ROLE
    let user_chatroom = user.USER_NUMBERS
    let room_name = document.querySelector("#room_name_text").value
    let code = document.querySelector("#code_text").value
    let type = (document.querySelector("#room_type_area").checked ? TYPE : SUBJECT)
    if (room_name === "" || code === "") {
        alert("Please input room name or code!")
    }
    else {
        data =  {
            EMAIL : user_email, 
            ROLE : user_role,
            ROOM_NAME : room_name,
            CODE : code,
            TYPE : type,
        }
        console.log(data)

        fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
        .then((data) => {
            let status = data.STATUS
            let chatroom = data.CHATROOM
            if (status !== 200) {
                alert("Code or room name is duplicate!")
            }
            else {
                new_data = {
                    EMAIL : user_email,
                    ROLE : user_role,
                    CHATROOM : chatroom,
                }
                console.log('new_data:\n' + JSON.stringify(new_data))
                sessionStorage.setItem('user', JSON.stringify(new_data))
                window.location.replace(URL + '/main')
            }
        });
    }
})