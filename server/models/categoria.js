const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
/* 
let nombresValidos = {
    values: ['expresso', 'americano', 'cortado', 'ristretto', 'carajillo'],
    message: '{VALUE} no es un tipo de servicio valido'
}
 */
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Es requerido la descripcion']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
/* categoriaSchema.plugin(uniqueValidator, { message: '{PATH} tiene que ser unico' }); */
module.exports = mongoose.model('Categoria', categoriaSchema);