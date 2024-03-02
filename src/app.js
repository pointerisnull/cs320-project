/*Try not to break anything please :)*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public0', req.url);

    // If the URL is '/', serve Home.html
    if (req.url === '/') {
        filePath = path.join(__dirname, 'public0', 'index.html');
    }

    // Check if the requested file is within the public0 directory
    if (filePath.indexOf(path.join(__dirname, 'public0')) !== 0) {
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
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            res.end(data);
        }
    });
});

const PORT = 80;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
