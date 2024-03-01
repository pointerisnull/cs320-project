document.getElementById('forgot-password-btn').addEventListener('click', function() {
    // Redirect to the forgot password page or trigger the forgot password process
    alert('Forgot Password functionality triggered!');
    //window.location.href = "";
});

document.getElementById('sign-up-btn').addEventListener('click', function() {
    // Redirect to the forgot password page or trigger the forgot password process
    alert('Sign Up functionality triggered!');
});

// function redirectToPage() {
//     // Change the URL to the desired destination
//     window.location.replace = "http://localhost:80/gamezcentral/signup";
// }

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for demonstration purposes

    // Here you can handle the login process using JavaScript or make an AJAX request to a server
    // For demonstration, let's just display the entered username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    alert(`Username: ${username}\nPassword: ${password}`);
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for demonstration purposes

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const avatar = document.getElementById('avatar').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Here you can handle the sign-up process using JavaScript or make an AJAX request to a server
    // For demonstration, let's just display the entered data
    alert(`Email: ${email}\nUsername: ${username}\nPassword: ${password}\nAvatar: ${avatar}`);
});
