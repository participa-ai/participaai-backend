const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const CategoriaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    categoria: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    descricao: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
    },
    localizacao: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    },
    foto: {
        nome: String,
        uri: String,
    },
    status: {
        type: String,
        enum: ['aberto', 'analisando', 'executando', 'finalizado'],
        default: 'aberto',
    },
    resposta: {
        descricao: String,
        data: Date,
        usuario: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuario',
        },
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

module.exports = mongoose.model('Problema', CategoriaSchema, 'problemas');
