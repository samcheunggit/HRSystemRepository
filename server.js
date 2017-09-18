// // server.js
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());
// app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=>console.log('Running'));




// const express = require('express');
// const app = express();
// // Run the app by serving the static files
// // in the dist directory
// app.use(express.static(__dirname + '/dist'));
// // Start the app by listening on the default
// // Heroku port
// app.listen(process.env.PORT || 8080);