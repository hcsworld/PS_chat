let button = document.querySelector('#login');

button.addEventListener("click", () => {
    let id = document.querySelector('#id');
    let password = document.querySelector('#password');

    if ((id.value === "student") && (password.value === "1234")) {
        location.replace("./studentpage.html");
    }
    else if (id.value === "professor" && password.value === "1234") {
        location.replace("./Profpage.html")
    }
})
