const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../models/categoria');

/* 
    generar 5 servicios
*/
// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    /* Categoria.find((err, categorias) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categorias
        });
    }); */
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});
/* 
    Mostrar categoria por ID
*/
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.finById(...);
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'El id no es correcto'
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });
});

/* 
    Crear nueva categoria
*/
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    // req. usuario._id //=Regresa id de usuario creador de categoria
    let body = req.body;
    /* let servicio = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion
    });
    servicio.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    }); */
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
/* 
    Actualiza la categoria
*/
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
        // let actualizar = req.body;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion,

    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        /* if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } */
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });
});

/* 
    Delete de la categoria
*/
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias y verificar token
    // categoria.findByIdRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'El id no existe'
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });
});
module.exports = app;