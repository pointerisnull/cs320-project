const express = require('express');
const path = require('path');

// mongoConnection
const { connectToDatabase } = require('./mongoConnection')

const app = express();

// webpage display
app.get('/api', (req, res) => { // localhost:3000/api
    res.json(`HTTP GET request recieved`)
})

// app.use(express.static(path.join(__dirname + '/public0'))); // http://localhost:3000/
app.use('/website', express.static(path.join(__dirname, 'public0'))); // run on subdir of root (http://localhost:3000/website/)

app.use('/', express.static(path.join(__dirname + '/react-app/build'))); // ex of react application hosting

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
})