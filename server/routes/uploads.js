const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    // validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos,
                type: tipo
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    // console.log(extension);

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas,
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Aqui, imagen cargada
        /* res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        }); */
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            // console.log(tipo);
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        /* let pathImage = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        } */
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioG) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioG,
                img: nombreArchivo
            });
        })
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El produco no existe`
                }
            });
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
                nombreArchivo
            });
        });
    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;