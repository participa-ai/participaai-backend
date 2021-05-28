exports.validateCpf = (cpf) => {
    if (typeof cpf !== 'string') {
        return false;
    }

    cpf = cpf.replace(/[\s.-]*/gim, '');

    if (
        cpf.length !== 11 ||
        !Array.from(cpf).filter((e) => e !== cpf[0]).length
    ) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;
    for (var i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
};

exports.getUsuarioDto = (request) => {
    const { nome, email, senha, tipo, cpf, matricula } = request.body;
    let usuario = {};

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email?.toLowerCase();
    if (senha) usuario.senha = senha;
    if (tipo) usuario.tipo = tipo;

    if (tipo === 'admin') {
        if (matricula) usuario.matricula = matricula;
    } else if (tipo === 'cidadao') {
        if (cpf) usuario.cpf = cpf;
    }

    return usuario;
};

exports.validateInsert = (usuarioDto) => {
    let emptyFields = new Array();
    let invalidFields = new Array();

    if (!usuarioDto.nome) {
        emptyFields.push('nome');
    }

    if (!usuarioDto.email) {
        emptyFields.push('email');
    }

    if (!usuarioDto.senha) {
        emptyFields.push('senha');
    }

    if (!usuarioDto.tipo) {
        emptyFields.push('tipo');
    }

    if (usuarioDto.tipo === 'admin') {
        delete usuarioDto.cpf;
        if (!usuarioDto.matricula) {
            emptyFields.push('matricula');
        }
    }

    if (usuarioDto.tipo === 'cidadao') {
        delete usuarioDto.matricula;
        if (!usuarioDto.cpf) {
            emptyFields.push('cpf');
        } else if (!this.validateCpf(usuarioDto.cpf)) {
            invalidFields.push('cpf');
        }
    }

    if (emptyFields.length > 0) {
        return `Os seguintes campos devem ser preenchidos: ${emptyFields.toString()}.`;
    }

    if (invalidFields.length > 0) {
        return `Campos inválidos: ${invalidFields.toString()}`;
    }

    return '';
};

exports.validateUpdate = (usuarioDto, usuario) => {
    delete usuarioDto.senha;

    if (usuario.tipo === 'admin') {
        delete usuarioDto.cpf;
    }

    if (usuario.tipo === 'cidadao') {
        delete usuarioDto.matricula;
        if (usuarioDto.cpf && !this.validateCpf(usuarioDto.cpf))
            return 'Campos inválidos: cpf';
    }

    if (usuarioDto.tipo && usuarioDto.tipo !== usuario.tipo) {
        return 'Não é possível alterar o tipo do usuário.';
    } else {
        delete usuarioDto.tipo;
    }

    return '';
};
