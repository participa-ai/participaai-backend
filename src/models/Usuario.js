const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongooseDelete = require('mongoose-delete');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Email inválido',
        ],
    },
    cpf: String,
    matricula: {
        type: String,
        trim: true,
    },
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
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
});

UsuarioSchema.plugin(mongooseDelete, {
    deletedAt: true,
    indexFields: ['deleted'],
    overrideMethods: true,
});

UsuarioSchema.index({ cpf: 1, matricula: 1, deletedAt: 1 }, { unique: true });

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

UsuarioSchema.methods.getResetToken = function () {
    const resetTokenHash = crypto.randomBytes(4).toString('hex').toLowerCase();

    this.senha = resetTokenHash;

    return resetTokenHash;
};

const model = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
model.syncIndexes();

module.exports = model;
