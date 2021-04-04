const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Email inválido',
        ],
    },
    cpf: String,
    matricula: String,
    tipo: {
        type: String,
        enum: ['admin', 'cidadao'],
        default: 'cidadao',
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: 6,
        select: false,
    },
    resetToken: {
        hash: String,
        validade: Date,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    deletado: {
        type: Boolean,
        default: false,
    },
});

UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
});

UsuarioSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

UsuarioSchema.methods.matchPassword = async function (senhaEnviada) {
    return await bcrypt.compare(senhaEnviada, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
