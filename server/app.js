const express = require('express'),
    path = require('path');

let app = express();

/* servidor.get('/', (req, resp) => {
    resp.send('Hola mundo');
}).listen(3000); */
app.use(express.static(path.resolve(__dirname, './public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
}).listen(3000);
console.log(path.join(__dirname, './public/index.html'));