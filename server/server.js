require('../server/config/config');
const express = require('express'),
    bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


/* app.get('/', (req, res) => {
    res.json('Hellow World');
}); */

/* GET */
app.get('/usuario', (req, res) => {
    res.send('Hola mundo ');
});

/* POST: Crear registros */
app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body
        });
    }
});

/* PUT: Actualizar datos */
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

/* DELETE */
app.delete('/usuario', (req, res) => {
    res.json('delet usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});