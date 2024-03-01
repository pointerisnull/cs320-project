const express = require('express');
const path = require('path');

// mongoConnection
const { connectToDatabase } = require('./mongoConnection')

const app = express();

// webpage display
app.get('/api', (req, res) => { // localhost:3000/api
    res.json(`HTTP GET request recieved`) // print msg on page ig
})

app.use('/gamezcentral', express.static(path.join(__dirname, 'public0/Home.html'))); // home page (http://localhost:80/gamezcentral)
app.use('/gamezcentral/chess', express.static(path.join(__dirname, 'public0/Chess.html'))); // home page (http://localhost:80/gamezcentral/chess)
app.use('/gamezcentral/risk', express.static(path.join(__dirname, 'public0/Risk.html'))); // home page (http://localhost:80/gamezcentral/risk)
app.use('/gamezcentral/tictactoe', express.static(path.join(__dirname, 'public0/Tic-Tac-Toe.html'))); // home page (http://localhost:80/gamezcentral/tictactoe)


app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

app.listen(80, () => { // http://localhost:80/
    console.log("App listening on port 80");
})

// app.use('/<name>', express.static(path.join(__dirname, '<html>'))); // run on subdir of root (http://localhost:80/<name>/)
//app.use('/', express.static(path.join(__dirname + '/react-app/build'))); // ex of react application hosting
