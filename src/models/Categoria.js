const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const CategoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
});

CategoriaSchema.plugin(mongooseDelete, {
    deletedAt: true,
    indexFields: true,
    overrideMethods: true,
});

module.exports = mongoose.model('Categoria', CategoriaSchema, 'categorias');
