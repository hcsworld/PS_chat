const URL = "http://localhost:8000";
const socket = io(URL + '/', { autoConnect: true });

const EMAIL = 'email'
const PW = 'password'
const ROLE = 'role'
const STUDENT = 'student'
const PROFESSOR = 'professor'

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

const sign_up_btn = document.querySelector("#sign_up_btn")
sign_up_btn.addEventListener("click", (evt)=> {

    evt.preventDefault()
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    let password_check = document.querySelector("#password_check").value
    if (!validateEmail(email)) {
        alert("Please input correct email address.")
    }
    else if (password === "" || password_check === "") {
        alert("Please input password!")
    }
    else if (password !== password_check) {
        alert("Passwords are not match!")
    }
    else {
        student_checked = document.querySelector("#student_radio_btn").checked
        let role = student_checked ? STUDENT : PROFESSOR
        data =  {
            EMAIL : email,
            PW : password,
            ROLE : role
        }
        // console.log(data)

        fetch('/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            console.log(response.status)
            if (response.status === 200) {
                window.location.replace(URL + '/log_in')
                // fetch(URL + '/log_in', {method: 'GET'})
            }
            else {
                alert('Your e-mail is used already!')
            }
            console.log(response.status);
        });
    }
})


const cancel_btn = document.querySelector("#cancel_btn")
cancel_btn.addEventListener("click", ()=> {
    
    // message_typing_area = document.querySelector("#sign_up_btn")
    // message_typing_area = document.querySelector("#message_typing_area")
    // message = message_typing_area.value;
    // if (message.length > 0) {
    //     socket.emit("hello", message)
    // }
    // message_typing_area.value = "";
})

