document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    const loginForm = document.getElementById('login-form');
    const signUpForm = document.getElementById('signup-form');

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', function() {
            // Redirect to the forgot password page or trigger the forgot password process
            alert('Forgot Password functionality triggered!');
            // window.location.href = "";
        });
    }

    if (signUpBtn) {
        signUpBtn.addEventListener('click', function() {
            // Redirect to the forgot password page or trigger the forgot password process
            // alert('Sign Up functionality triggered!');
        });
    }

    // This if block is executed when the login form is filled out and submitted. 
    // It will take the filled out information and send it server-side to verify the information
    // with what is in the database. Part of the data that is sent back client-side is a token. 
    // This token (JWT) is what shows whether a user is logged in or not. These tokens are unique to every user.
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            alert(`Username: ${username}\nPassword: ${password}`);

            // Send a POST request to the server with username and password
            fetch('/html/login.html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert('Incorrect username or password');
                }
            })
            .then(data => {
                console.log(data);
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                console.log("Token put in local storage: ", data.token);
                // Redirect to home page if login is successful
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error:', error);
            });

        });
    }

    // This if block is executed when the signup form is filled out and submitted. 
    // It will take the filled out information and send it server-side to be inserted into the database.
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
    
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            // Perform a POST request to the server to submit user signup data
            fetch('/html/signup.html', {
                method: 'POST', // Using the HTTP POST method
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                // Use FormData to collect form data and URLSearchParams to encode it
                body: new URLSearchParams(new FormData(signUpForm)),
            })
            .then(response => {
                // Check if the network response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                loginUser(username, password);
            })
            .catch(error => {
                // Handle errors during the fetch operation
                console.error('There was a problem with the fetch operation:', error);
            });

            // Display a summary of the entered data to the user
            alert(`Email: ${email}\nUsername: ${username}\nPassword: ${password}\nAvatar: ${avatar}`);
        });
    }

    // This function should only be called when a user first signup. This function automatically logins the user after signup.
    function loginUser(username, password) {
        // Send a POST request to the server with username and password
        fetch('/html/login.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert('Incorrect username or password');
            }
        })
        .then(data => {
            console.log(data);
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            console.log("Token put in local storage: ", data.token);
            // Redirect to home page if login is successful
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // The stuff below deals with logging in and out. All of this is called on every page load to 
    // ensure that the proper links, images, etc. are displayed based on whether or not a user is logged in or not.

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Get references to DOM elements which are the links in our dropdown menu in the top-right of each page
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const profileLink = document.getElementById('profileLink');
    const storeLink = document.getElementById('storeLink');
    const cartLink = document.getElementById('cartLink');
    const logoutLink = document.getElementById('logoutLink');
    const coinIcon = document.getElementById('coin');
    const accountImage = document.getElementById('accountImage');

    if (token) {
        // User is logged in
        // Show logout button and hide login and signup links and display other links
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        profileLink.style.display = 'block';
        storeLink.style.display = 'block';
        cartLink.style.display = 'block';
        logoutLink.style.display = 'block';
        coinIcon.style.display = 'block';

        // Add event listener for logout
        logoutLink.addEventListener('click', function() {
            // Clear token from localStorage
            localStorage.clear();
            // Redirect user to logout route (which is just our home page (i.e., /index.html or '/'))
            window.location.href = '/';
        });
    } else {
        // User is logged out
        // Show login and signup links and hide other links.
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        profileLink.style.display = 'none';
        storeLink.style.display = 'none';
        cartLink.style.display = 'none';
        logoutLink.style.display = 'none';
        coinIcon.style.display = 'none';
        accountImage.src = './Media/profile/account.png';
        accountImage.width = "40px";
        accountImage.height = "40px";
        accountImage.type = "image/svg+xml";
    }
});

// This function is called whenever the profile.html page is loaded. It fetches the user data and updates profile page.
async function fetchUserData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        const response = await fetch('/user-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        // Update profile information
        document.getElementById('username').textContent = data.user_name;
        document.getElementById('email').textContent = data.email;
        document.getElementById('balance').textContent = data.balance;
        document.getElementById('password').textContent = data.password;
        document.getElementById('userid').textContent = data._id;

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// This function is called whenever a user and/or there state needs to be updated. This function to update user information 
// is completely generalized and can be used for any type of updated data as long as that data belongs to a field in the database.
async function updateUser(userId, updatedInfo) {
    try {

        const response = await fetch('/update-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                updatedInfo: updatedInfo
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update user information');
        }

        const data = await response.json();
        console.log('User information updated successfully:', data);
    } catch (error) {
        console.error('Error updating user information:', error);
    }
}

// This function should be called on every page load. This function 
// fetches the balance and avatar based on user data and display it on the top ui.
async function fetchBalanceAndAvatar() {
    try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        // Fetch user data using token
        const response = await fetch('/user-data', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        // Parse response data
        const data = await response.json();

        // Add balance on top ui (the top right where the drop down menu is)
        document.getElementById('balanceTop').textContent = data.balance;

        // This massive if/else block is what changes the data attribute (this is the src location for html objects) 
        // of the account image on each page to whatever avatar the user selected on signup.
        if(data.avatar === "P0") {
            if(!window.location.href.includes('/html/')) {
                accountImage.data = './html/Media/profile/topUI/account-avatar-profile-user-3-svgrepo-com.svg';  
            }
            else {
                accountImage.data = './Media/profile/topUI/account-avatar-profile-user-3-svgrepo-com.svg';
            }
            accountImage.width = "55px";
            accountImage.height = "55px";
            accountImage.type = "image/svg+xml";
        }
        else if(data.avatar === "P1") {
            if(!window.location.href.includes('/html/')) {
                accountImage.data = './html/Media/profile/topUI/account-avatar-profile-user-15-svgrepo-com.svg';
            }
            else {
                accountImage.data = './Media/profile/topUI/account-avatar-profile-user-15-svgrepo-com.svg';
            }
            accountImage.width = "55px";
            accountImage.height = "55px";
            accountImage.type = "image/svg+xml";
        }
        else if(data.avatar === "P2") {
            if(!window.location.href.includes('/html/')) {
                accountImage.data = './html/Media/profile/topUI/account-avatar-profile-user-16-svgrepo-com.svg';
            }
            else {
                accountImage.data = './Media/profile/topUI/account-avatar-profile-user-16-svgrepo-com.svg';
            }
            accountImage.width = "55px";
            accountImage.height = "55px";
            accountImage.type = "image/svg+xml";
        }
        else {
            if(!window.location.href.includes('/html/')) {
                accountImage.src = './html/Media/profile/account.png';
            }
            else {
                accountImage.src = './Media/profile/account.png';
            }
            accountImage.width = "40px";
            accountImage.height = "40px";
            accountImage.type = "image/svg+xml";
        }
    } catch (error) {
        // Log error if fetching balance fails
        console.error('Error fetching balance and/or avatar:', error);
    }
}