require('../server/config/config');

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));

let addressDB = 'mongodb+srv://cafe:Maiz.10@cluster0-bxlqf.mongodb.net/cafe?retryWrites=true&w=majority';
let localhostDB = 'mongodb://localhost:27017/cafe'

mongoose.connect(process.env.NODE_ENV, (err, res) => {
    if (err) throw err('Error en puerto');
    else console.log(`Base de datos ONLINE`);
});

app.listen(process.env.PORT, err => {
    if (err) {
        console.log(`Error en inicio de servidor: ${err}`)
    } else {
        console.log(`Server on port: ${process.env.PORT}`);
    }
});

/* Descencryptado de token */
/* function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
} */