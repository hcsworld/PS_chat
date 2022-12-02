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

const log_in_btn = document.querySelector("#log_in_btn")
log_in_btn.addEventListener("click", (evt)=> {

    evt.preventDefault()
    let email = document.querySelector("#email").value
    let password = document.querySelector("#password").value
    if (!validateEmail(email)) {
        alert("Please input correct email address.")
    }
    else if (password === "" || email === "") {
        alert("Please input email or password!")
    }
    else {
        data =  {
            EMAIL : email,
            PW : password,
        }
        // console.log(data)

        fetch('/main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
        .then((data) => {
            // console.log('response:\n' + JSON.stringify(data))
            // data = JSON.parse(data)
            // console.log(data)
            if (Object.keys(data).length !== 0) {
                // console.log('response :\n' + response.json())
                // console.log(response.body)
                sessionStorage.setItem('user', JSON.stringify(data))
                window.location.replace(URL + '/main')
            }
            else {
                alert('Your email or password is wrong, or you are not registered!')
            }
            // console.log(response.status);
        });
    }
})