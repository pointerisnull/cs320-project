/*Try not to break anything please :)*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { createUser } = require('./database-scripts/User/UserInsert');
const { handleLeaderboardRequest } = require('./handlers/leaderBoardHandler');
const { handleUserAuthentication } = require('./handlers/authenticateUserHandler');
const { secretKey, generateToken, verifyToken } = require('./handlers/JWTTokenHandler');
const { handleUserDataRequest } = require('./handlers/userDataHandler');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url);


    // Handle POST requests for signups
    if (req.method === 'POST' && req.url === '/html/signup.html') {
        console.log('Handling POST request for /signup.html');
        let data = '';

        // Collect data from the request
        req.on('data', (chunk) => {
            console.log('Data chunk received:', chunk);
            data += chunk;
        });

        // Process the collected data when the request ends
        req.on('end', async () => {
            try {
                // Parse the form data
                console.log('Received form data:', data);
                const formData = querystring.parse(data);
                console.log('Parsed form data:', formData);

                // Now 'formData' will contain the user input
                const email = formData.email;
                const username = formData.username;
                const password = formData.password;
                const avatar = formData.avatar;

                // Move MongoDB operations here
                await createUser(username, password, email, avatar);

                // Respond to the client
                res.end('User signed up successfully!');
            } catch (error) {
                console.error('Error processing form data:', error);
                res.end('Internal Server Error');
            }
        });
        return;
    }

    // Handle POST request for login
    if (req.method === 'POST' && req.url === '/html/login.html') {
        let data = '';
        // Accumulate request data
        req.on('data', chunk => {
            data += chunk;
        });
        // Handle request end
        req.on('end', async () => {
            try {
                // Parse incoming data
                const { username, password } = JSON.parse(data);
                // Check user authentication
                const isAuthenticated = await handleUserAuthentication(username, password);

                if(isAuthenticated) {
                    console.log('User authenticated successfully');
                    // Generate token for the user
                    const token = generateToken({ username });
                    // Set response status code and send token
                    res.statusCode = 200;
                    res.end(JSON.stringify({ token }));
                }
                else {
                    // If user authentication fails, set response status code to 401
                    console.log('User authentication failed');
                    res.statusCode = 401;
                    res.end();
                }
            } catch (error) {
                // Handle errors during login request processing
                console.error('Error processing login request:', error);
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        });
        return;
    }
    
    // Handles the leaderboard get request
    if (req.method === 'GET' && req.url === '/leaderboard-data') {
        handleLeaderboardRequest(req, res);
        return; // End the request here to prevent further processing
    }

    // Handles the user data get request
    if (req.method === 'GET' && req.url === '/user-data') {
        // Extract token from request headers
        const token = req.headers.authorization.split(' ')[1];
        // Verify the token
        const decodedToken = verifyToken(token);

        // Check if token is invalid or expired
        if (!decodedToken) {
            // Token is invalid or expired
            res.statusCode = 401; // Unauthorized
            res.end('Unauthorized');
            return;
        }

        // Extract username from decoded token
        const username = decodedToken.username;
        // Process user data request
        handleUserDataRequest(req, res, username);
        return; // End the request here to prevent further processing
    }
    
    // If the URL is '/', serve Home.html
    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    }

    // Check if the requested file is within the html directory
    if (filePath.indexOf(__dirname) !== 0) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Read the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found!');
            } else {
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        } else {
            // Determine the content type based on the file extension
            const ext = path.extname(filePath);
            let contentType = 'text/html'; // default to HTML
            switch (ext) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                // Add more cases for other file types if needed
            }

            // Set the appropriate content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const PORT = 80;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
