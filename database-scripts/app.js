const express = require('express');
const path = require('path');

// mongoConnection
const { connectToDatabase } = require('./mongoConnection')

const app = express();

// webpage display
app.get('/api', (req, res) => { // localhost:80/api
    res.json(`HTTP GET request recieved`) // print msg on page ig
})

app.use('/gamezcentral', express.static(path.join(__dirname, 'public0/Home.html'))); // home page (http://localhost:80/gamezcentral)
app.use('/gamezcentral/chess', express.static(path.join(__dirname, 'public0/Chess.html'))); // chess page (http://localhost:80/gamezcentral/chess)
app.use('/gamezcentral/risk', express.static(path.join(__dirname, 'public0/Risk.html'))); // risk page (http://localhost:80/gamezcentral/risk)
app.use('/gamezcentral/tictactoe', express.static(path.join(__dirname, 'public0/Tic-Tac-Toe.html'))); // tictactoe page (http://localhost:80/gamezcentral/tictactoe)
app.use('/gamezcentral/login', express.static(path.join(__dirname, 'public0/Login.html'))); // login page (http://localhost:80/gamezcentral/login)
app.use('/gamezcentral/signup', express.static(path.join(__dirname, 'public0/signUp.html'))); // signup page (http://localhost:80/gamezcentral/signup)

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

app.listen(80, () => { // http://localhost:80/
    console.log("App listening on port 80");
})

// app.use('/<name>', express.static(path.join(__dirname, '<html>'))); // run on subdir of root (http://localhost:80/<name>/)
//app.use('/', express.static(path.join(__dirname + '/react-app/build'))); // ex of react application hosting
