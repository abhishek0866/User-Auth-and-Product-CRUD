const square = document.getElementById("square");
const frontSide = document.getElementById("frontSide");
const rightSide = document.getElementById("rightSide");
const leftSide = document.getElementById("leftSide");
const leftSubmitBtn = document.getElementById('new');
const lastDiv = document.querySelector('.last');
const loading = document.getElementById("loading");

frontSide.addEventListener("click", () => {
    frontSide.style.display = "none";
    rightSide.style.display = "block";
    leftSide.style.display = "block";
    square.style.transform = "rotate3d(0, 0, 0, 90deg)";
    document.title = "Login page";
});

rightSide.addEventListener("click", () => {
    rightSide.style.display = "none";
    frontSide.style.display = "block";
    leftSide.style.display = "block";
    square.style.transform = "rotate3d(0, -1, 0, 90deg)";
    document.title = "Sign up page";
});

leftSide.addEventListener("click", () => {
    leftSide.style.display = "none";
    frontSide.style.display = "block";
    rightSide.style.display = "block";
    square.style.transform = "rotate3d(0, 1, 0, 90deg)";
    document.title = "Forgot password page";
});

function regSubmitForm(event) {
    event.preventDefault(); // prevent default form submission behavior
    const email = document.getElementById("email1").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password1").value;
    const data = { email, name, password };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/register");
    xhr.setRequestHeader("Content-Type", "application/json");
    loading.style.display = "block";
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            localStorage.setItem('token', response.token);
            window.location.href = 'dashboard.html';
        } else {
            const errorContainer = document.querySelector('#error-container');
            errorContainer.textContent = 'Registration failed, please try again.'
            console.log(xhr.responseText);
        }
    };
    
    xhr.send(JSON.stringify(data));
};




function logSubmitForm(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/login');
    xhr.setRequestHeader('Content-Type', 'application/json');
    loading.style.display = "block";
    xhr.onreadystatechange = function () {
        loading.style.display = "none";
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                localStorage.setItem('token', response.token); // save token in localStorage
                window.location.href = 'dashboard.html'; // redirect to dashboard page
            } else {
                alert('Login failed');
            }
        }
    };

    xhr.send(JSON.stringify({ email, password }));
};


function forgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById("email2").value;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/forgotPassword");
    xhr.setRequestHeader("Content-Type", "application/json");
    if (!email) {
        alert('No account with that email exists');
        return;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                window.location.href = "password.html"
            } else {
                alert('SomeThing Went Wrong');
            }
        }
    };

    const data = JSON.stringify({ email: email });
    xhr.send(data);
}



function resetPassword(event) {
    event.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');
    const password = document.getElementById("email3").value;
    const confirmPassword = document.getElementById("password3").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/resetPassword?token=' + token);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message); // show success message
                window.location.href = 'dashboard.html'; // redirect to dashboard page
            } else {
                alert('Password reset failed');
            }
        }
    };

    xhr.send(JSON.stringify({ password, confirmPassword }));
};









