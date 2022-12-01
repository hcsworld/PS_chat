let button = document.querySelector('#login');

button.addEventListener("click", () => {
    console.log("click!");
    let id = document.querySelector('#id');
    let password = document.querySelector('#password');
    console.log(id.value);
    console.log(password.value);
    if ((id.value === "student") && (password.value === "1234")) {
        location.replace("./studentpage.html");
    }
    else if (id.value === "professor" && password.value === "1234") {
        location.replace("./Profpage.html")
    }
})
