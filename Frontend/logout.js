if (!localStorage.getItem('token')) {
    window.location.href = "RegisterForm.html"; // redirect to login page
}

function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/logout");
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('token')}`);
    xhr.onload = () => {
        if (xhr.status === 200) {
            localStorage.removeItem('token'); // clear token from local storage
            window.location.href = "RegisterForm.html"; // redirect to login page
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.send();
}


