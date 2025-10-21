const submit = (event) => {
    event.preventDefault(); // stop form from refreshing the page

    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.text())
        .then((data) => {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            window.location.href = "home.html";
        })
        .catch((err) => {
            document.getElementById("result").innerHTML =
                "Error: " + err.message;
        });
};

const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", submit);
