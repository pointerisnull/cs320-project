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

    if (signUpForm) {
        signUpForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
            console.log(avatar);
    
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
            .catch(error => {
                // Handle errors during the fetch operation
                console.error('There was a problem with the fetch operation:', error);
            });

            // Display a summary of the entered data to the user
            alert(`Email: ${email}\nUsername: ${username}\nPassword: ${password}\nAvatar: ${avatar}`);
        });
    }

    // The stuff below deals with logging in and out.

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Get references to DOM elements which are the links in our dropdown menu in the top-right of each page
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const profileLink = document.getElementById('profileLink');
    const storeLink = document.getElementById('storeLink');
    const logoutLink = document.getElementById('logoutLink');
    const coinIcon = document.getElementById('coin');

    if (token) {
        // User is logged in
        // Show logout button and hide login and signup links
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        profileLink.style.display = 'block';
        storeLink.style.display = 'block';
        logoutLink.style.display = 'block';
        coinIcon.style.display = 'block';


        // Add event listener for logout
        logoutLink.addEventListener('click', function() {
            // Clear token from localStorage
            localStorage.clear();
            // Redirect user to logout route (which is just our home page (i.e., index.html or '/'))
            window.location.href = '/';
        });
    } else {
        // User is logged out
        // Show login and signup links and hide logout button
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        profileLink.style.display = 'none';
        storeLink.style.display = 'none';
        logoutLink.style.display = 'none';
        coinIcon.style.display = 'none';
    }
});

// These functions below deal with fetching needed data. Whether that is for the leaderboard page or the profile page or whatever else. This was absolute hell trying to figure out...

// Fetch balance based on user data and display on top ui (this function should be ran on all pages on window load)
async function fetchBalance() {
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

        // Add balance on top ui
        document.getElementById('balanceTop').textContent = data.balance;
    } catch (error) {
        // Log error if fetching balance fails
        console.error('Error fetching balance:', error);
    }
}

// Fetch leaderboard data and update the table
async function fetchLeaderboardData() {
    const response = await fetch('/leaderboard-data');
    const data = await response.json();

    // Update the table with the fetched data
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach((user) => {
        const row = `<tr>
                        <td>${user.user_name}</td>
                        <td>${user.email}</td>
                        <td>${user.balance}</td>
                    </tr>`;
        tbody.innerHTML += row;
    });
}

// Fetch user data and update profile page
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

function addToCart(item) {
    if(item === "coinPack1") {
        const numberOfItem = parseInt(localStorage.getItem('coinPack1'));
        if(!numberOfItem) {
            localStorage.setItem('coinPack1', 1);
            console.log("There are ", numberOfItem, "coinPack1s in the cart.");
        }
        else {
            const updatedNumberOfItem = numberOfItem + 1;
            localStorage.setItem('coinPack1', numberOfItem + 1);
            console.log("There are ", updatedNumberOfItem, "coinPack1s in the cart.");
        }
    }
    else if(item === "coinPack2") {
        const numberOfItem = parseInt(localStorage.getItem('coinPack2'));
        if(!numberOfItem) {
            localStorage.setItem('coinPack2', 1);
            console.log("There are ", numberOfItem, "coinPack2s in the cart.");
        }
        else {
            const updatedNumberOfItem = numberOfItem + 1;
            localStorage.setItem('coinPack2', numberOfItem + 1);
            console.log("There are ", updatedNumberOfItem, "coinPack2s in the cart.");
        }
    }
    else if(item === "coinPack3") {
        const numberOfItem = parseInt(localStorage.getItem('coinPack3'));
        if(!numberOfItem) {
            localStorage.setItem('coinPack3', 1);
            console.log("There are ", numberOfItem, "coinPack3s in the cart.");
        }
        else {
            const updatedNumberOfItem = numberOfItem + 1;
            localStorage.setItem('coinPack3', numberOfItem + 1);
            console.log("There are ", updatedNumberOfItem, "coinPack3s in the cart.");
        }
    }
    else if(item === "coinPack4") {
        const numberOfItem = parseInt(localStorage.getItem('coinPack4'));
        if(!numberOfItem) {
            localStorage.setItem('coinPack4', 1);
            console.log("There are ", numberOfItem, "coinPack4s in the cart.");
        }
        else {
            const updatedNumberOfItem = numberOfItem + 1;
            localStorage.setItem('coinPack4', numberOfItem + 1);
            console.log("There are ", updatedNumberOfItem, "coinPack4s in the cart.");
        }
    }
    else if(item === "coinPack5") {
        const numberOfItem = parseInt(localStorage.getItem('coinPack5'));
        if(!numberOfItem) {
            localStorage.setItem('coinPack5', 1);
            console.log("There are ", numberOfItem, "coinPack5s in the cart.");
        }
        else {
            const updatedNumberOfItem = numberOfItem + 1;
            localStorage.setItem('coinPack5', numberOfItem + 1);
            console.log("There are ", updatedNumberOfItem, "coinPack5s in the cart.");
        }
    }
}

function loadCart() {
    // Get all keys from local storage
    const keys = Object.keys(localStorage);
    let isEmpty = true;

    // Iterate over each key
    keys.forEach(key => {
        // Check if the key represents a coin pack
        if (key.startsWith('coinPack')) {
            isEmpty = false;
            // Get the quantity of the coin pack from local storage
            const quantity = parseInt(localStorage.getItem(key));

            // Create a new cart item element
            const cartItem = document.createElement('p');
            cartItem.textContent = `${quantity} ${key}`; // Display quantity and coin pack name
            document.getElementById('cartContainer').appendChild(cartItem); // Append item to cart container
        }
    });
    if(isEmpty) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'There is nothing in your cart right now!';
        emptyCartMessage.style.textAlign = 'center';
        emptyCartMessage.style.fontSize = '18px';
        document.getElementById('cartContainer').appendChild(emptyCartMessage);
    }
}
