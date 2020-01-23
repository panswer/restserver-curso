const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


/* 
    Obtener todos los productos
*/

app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // pupolate: usuario categoria
    // paginado
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email') /* populate(nombre,informacion) nombre: referencia al mismo tipo de atributo de la instancia*/
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

/* 
    Obtener producto por id
*/
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    // paginado x
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
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
                        message: 'ID no existente'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
    /* Producto.findById(id, (err, productoDB) => {
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
                    message: 'El id no coincide con ningun producto'
                }
            });
        }
        if (!productoDB.disponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encuentra disponible'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    }); */
});

/* 
    Buscar productos
*/
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');
    Producto.find({ nombre: regExp, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

/* 
    Crear un producto
*/
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body
        /* let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            disponible: true,
            descripcion: body.descripcion,
            categoria: body.categoria,
            usuario: req.usuario._id
        }); */
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        /* res.json({
            ok: true,
            productoDB
        }); */
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

/* 
    Actualizar un producto
*/
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    /* let productoEdit = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    }
    Producto.findByIdAndUpdate(id, productoEdit, { new: true }, (err, productoDB) => {
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
                    message: 'El id no coincide con ningun producto'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    }); */
    Producto.findById(id, (err, productoDB) => {
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
                    message: `Producto no existente`
                }
            });
        }
        let upDateProducto = {
            nombre: req.body.nombre ? req.body.nombre : productoDB.nombre,
            precioUni: req.body.precioUni ? req.body.precioUni : productoDB.precioUni,
            descripcion: req.body.descripcion ? req.body.descripcion : productoDB.descripcion,
            disponible: req.body.disponible == null ? productoDB.disponible : req.body.disponible,
            categoria: req.body.categoria ? req.body.categoria : productoDB.categoria,
            producto: req.body.producto ? req.body.producto : productoDB.producto
        }
        Producto.findByIdAndUpdate(id, upDateProducto, { new: true }, (err2, upData) => {
            if (err2) {
                return res.status(500).json({
                    ok: false,
                    err: err2
                });
            }
            res.status(201).json({
                ok: true,
                upData
            });
        });
    });
});
/* 
    Borrar un producto
*/
app.delete('/productos/:id', verificaToken, (req, res) => {
    // No borrar de base de datos, cambiar disponible a false
    let id = req.params.id;
    let cambiaEstatus = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaEstatus, { new: true }, (err, productoDB) => {
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
                    message: 'El id no coincide con un producto'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

module.exports = app;