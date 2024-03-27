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

// These functions below deal with fetching needed data. Whether that is for the leaderboard page or the profile page or whatever else. This was absolute hell trying to figure out...

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

// This function is called whenever the leaderboard.html page is loaded. It fetches leaderboard data and updates the table.
async function fetchLeaderboardData() {
    const response = await fetch('/leaderboard-data');
    const data = await response.json();

    // Update the table with the fetched data
    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // The win/loss/games played fields are zeroed out for now.
    data.forEach((user) => {
        const row = `<tr>
                        <td>${user.user_name}</td>
                        <td>${user._id}</td>
                        <td>${user.balance}</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>`;
        tbody.innerHTML += row;
    });
}

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

// This function is called when the "Add to Cart" button is pressed on the store.html page. It takes the item that is being added as a parameter. 
// If the item already exists in the local storage (i.e., one or more of that specific item is already in the cart), then the number of that item 
// in the local storage increases by one. If the item does not exist yet, then a new key is created and put into local storage.
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

    var sound = new Audio("./Media/gamez/etc/audio/addToCart.mp3");
    sound.play();
    checkCart();
}

// These three arrays are the exact costs of each item, the names of each item, and the number of coins in each item, all in increasing order.
const coinPackCosts = [0.99, 2.99, 5.99, 9.99, 19.99];
const coinPackNames = ['Small Coin Pack (10 Coins)', 'Medium Coin Pack (40 Coins)', 'Large Coin Pack (100 Coins)', 'Extra Large Coin Pack (250 Coins)', 'Jumbo Coin Pack (500 Coins)'];
const coinPackAmounts = [10, 40, 100, 250, 500];


function loadCart() {
    // Get all keys from local storage
    const keys = Object.keys(localStorage);
    let totalOfAllCost = 0;
    let isEmpty = true;

    // Iterate over each key
    keys.forEach(key => {
        // Check if the key represents a coin pack
        if (key.startsWith('coinPack')) {
            isEmpty = false;
            // Get the quantity of the coin pack from local storage
            const quantity = parseInt(localStorage.getItem(key));
            const coinPackNumber = key;
        
            // Calculate index for cost and amount arrays
            const index = parseInt(coinPackNumber.match(/\d+/)[0]) - 1;

            // Calculate total cost
            const totalCost = quantity * coinPackCosts[index];

            // Create a new cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            // Create image element for the coin pack
            const coinPackImage = document.createElement('img');
            coinPackImage.src = `./Media/Store/${coinPackNumber}.png`;
            coinPackImage.alt = coinPackNumber;
            coinPackImage.width = '100';
            cartItem.appendChild(coinPackImage);

            // Display quantity and coin pack name
            const itemDetails = document.createElement('p');
            itemDetails.textContent = `${quantity} ${coinPackNames[index]}`;
            cartItem.appendChild(itemDetails);

            // Display cost
            const itemCost = document.createElement('p');
            itemCost.textContent = `Cost: $${totalCost}`;
            itemCost.style.fontWeight = 'bold';
            itemCost.style.textAlign = 'right';
            cartItem.appendChild(itemCost);

            document.getElementById('cartContainer').appendChild(cartItem); // Append item to cart container
            document.getElementById('cartEmptyButton').style.display = 'block';

            totalOfAllCost += totalCost;
        }
    });
    if(isEmpty) {
        // If the cart is empty then the cart.html page will display the following...
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'There is nothing in your cart right now!';
        emptyCartMessage.style.textAlign = 'center';
        emptyCartMessage.style.fontSize = '18px';
        document.getElementById('cartContainer').appendChild(emptyCartMessage);
        document.getElementById('cartEmptyButton').style.display = 'none';
        document.getElementById('cartBuyButton').innerText = 'Checkout the store!';
        document.getElementById('cartBuyButton').onclick = null;
        document.getElementById('cartBuyButton').addEventListener('click', function() {
            window.location.href = './store.html';
        });
    }
    else {
        // When the cart is not empty, this else block will display the total
        document.getElementById('cartContainer').appendChild(document.createElement('hr'));
        const displayTotal = document.createElement('p');
        displayTotal.textContent = `Total Cost: $${totalOfAllCost.toFixed(2)}`;
        displayTotal.style.fontSize = '16px';
        displayTotal.style.textAlign = 'center';
        displayTotal.style.fontWeight = 'bold';
        document.getElementById('cartContainer').appendChild(displayTotal);
    }
}

// This function should be called on every page load. This function is what 
// displays (or doesn't display) the cart icon and the number indicator in the top right dropdown area.
function checkCart() {
    // Get all keys from local storage
    const keys = Object.keys(localStorage);
    let totalItems = 0;

    // Iterate over each key
    keys.forEach(key => {
        // Check if the key represents a coin pack
        if (key.startsWith('coinPack')) {
            // Get the quantity of the coin pack from local storage
            totalItems += parseInt(localStorage.getItem(key));
        }
    });

    // Handles the two cases: cart is not empty or cart is empty.
    if(totalItems != 0) {
        document.getElementById('shoppingCart').style.display = 'block';
        if(totalItems < 10) {
            document.getElementById('cartItemCount').innerText = totalItems;
        }
        else {
            document.getElementById('cartItemCount').innerText = '9+';
        }
        document.getElementById('cartItemCount').style.display = 'block';
    }
    else {
        document.getElementById('shoppingCart').style.display = 'none';
        document.getElementById('cartItemCount').style.display = 'none';
    }
}

// This function is called when the "Empty Cart" button is pressed on the cart.html page or within the buyCart function.
function emptyCart() {
    const keys = Object.keys(localStorage);

    keys.forEach(key => {
        if(key.startsWith('coinPack')) {
            localStorage.removeItem(key);
        }
    });
    window.location.href = './cart.html';
}

// This function is called when the "Buy" button is pressed on the cart.html page.
async function buyCart() {
    
    // Get all keys from local storage
    const keys = Object.keys(localStorage);
    let totalOfAllCost = 0;

    // Iterate over each key
    keys.forEach(key => {
        // Check if the key represents a coin pack
        if (key.startsWith('coinPack')) {
            // Get the quantity of the coin pack from local storage
            const quantity = parseInt(localStorage.getItem(key));
            const coinPackNumber = key;
        
            // Calculate index for cost and amount arrays
            const index = parseInt(coinPackNumber.match(/\d+/)[0]) - 1;

            // Calculate total cost
            const totalCost = quantity * coinPackAmounts[index];

            totalOfAllCost += totalCost;
        }
    });

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

        // Setups up an object with the updated info to be passed between client and server. 
        // The updated info needs to be sent as an object as that is the argument that is required when directly updating the database.
        const updatedInfo = {
            balance: totalOfAllCost + data.balance
        };

        console.log(data._id, updatedInfo, typeof updatedInfo);
        updateUser(data._id, updatedInfo);

        // For processing animation (below)
        const animateProcessing = document.getElementById('animateProcessing');
        const animateProcessing_head = document.getElementById('animateProcessing_head');
        const animateProcessing_description= document.getElementById('animateProcessing_description');
        animateProcessing.style.display = 'block';
        animateProcessing_head.innerText = 'Proccessing Order!';
        animateProcessing_description.innerText = 'Your order is being processed...';
        animateProcessing.style.animation = 'none';
        animateProcessing.offsetHeight;
        animateProcessing.style.animation = null;
        // For processing animation (above)

        // Once the "Buy" button is clicked, this setTimeout block stops the cart from clearing and 
        // the page refreshing. This gives the appearance that the order is being processed.
        setTimeout(() => {
            emptyCart();
            animateProcessing.style.display = 'none';
            window.location.href('./cart.html');
        }, 9000)


    } catch (error) {
        // Log error if buying the cart fails
        console.error('Error with cart:', error);
    }
    
}
