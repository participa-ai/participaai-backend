const mongoose = require('mongoose');

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

module.exports = mongoose.model('Categoria', CategoriaSchema, 'categorias');
