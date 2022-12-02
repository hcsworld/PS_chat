const URL = "http://localhost:8000";
const socket = io(URL + '/', { autoConnect: true });

const EMAIL = 'email'
const PW = 'password'
const ROLE = 'role'
const STUDENT = 'student'
const PROFESSOR = 'professor'
let user = JSON.parse(sessionStorage.getItem('user'))
let user_email = user.EMAIL
let user_role = user.ROLE
let user_chatroom = user.CHATROOM

// console.log(user_email)
// console.log(user_role)
// console.log(user_room_num)

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
        // .then((response) => response.json())
        // .then((data) => {
        //     if (data.status === 200) {
        //         console.log(response)
        //         localStorage.setItem('user', JSON.stringify(response))
        //         window.location.replace(URL + '/main')
        //     }
        //     else {
        //         alert('Code is wrong, or you are already joined the chatroom!')
        //     }
        //     console.log(response.status);
        // });
        }
    }
)

