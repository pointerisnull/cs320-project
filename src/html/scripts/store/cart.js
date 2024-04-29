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
            itemCost.textContent = `Cost: $${Math.round(totalCost * 100) / 100}`;
            itemCost.style.fontWeight = 'bold';
            itemCost.style.textAlign = 'right';
            itemCost.style.marginLeft = 'auto'; // Aligns the cost to the right side of the container
            itemCost.style.marginRight = '10px'; // Adds some space between the cost and the container's edge
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

async function getData() {
    try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token is missing');
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
        return data;
    } catch (error) {
        // Log error if buying the cart fails
        console.error('Error with cart:', error);
        throw error;
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
