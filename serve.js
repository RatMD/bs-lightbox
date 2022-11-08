
const fs = require('fs');
const path = require('path');

const root = __dirname;
const mimes = {
    htm:    'text/html',
    html:   'text/html',
    txt:    'text/plain',
    md:     'text/markdown',
    css:    'text/css',
    js:     'application/javascript',
    jpg:    'image/jpeg',
    jpeg:   'image/jpeg',
    png:    'image/png',
    gif:    'image/gif',
    svg:    'image/svg+xml',
};

const server = require('http').createServer((req, res) => {
    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }

    // Fetch Request Path
    let request_path = req.url.toString().split('?')[0].trimEnd('/');
    if (request_path === '' || request_path === '/') {
        request_path = '/index.html';
    }
    if (request_path.startsWith('/bs-lightbox')) {
        request_path = request_path.slice('/bs-lightbox'.length);
    }

    // Print Request
    console.log(`[${req.method}] ${request_path}`);

    // LocalPath
    let local_path = path.join(root, 'docs', request_path);
    if (local_path.indexOf(root) !== 0) {
        req.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Forbidden');
    }

    // Check If file Exists
    if (!fs.existsSync(local_path)) {
        req.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('File not Found');
    }

    // Serve File
    let type = mimes[path.extname(local_path).slice(1)] || 'text/plain';
    let stream = fs.createReadStream(local_path);
    stream.on('open', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', type);
        stream.pipe(res);
    });
    stream.on('error', () => {
        res.statuscode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Unknown File Error');
    });
});
server.listen(3000);
