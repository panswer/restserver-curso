const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    // let pathImg = `./uploads/${tipo}/${img}`;
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    // console.log(path.resolve(__dirname, '../assets/no-imagen.jpg'));
    console.log(pathImage);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = app;