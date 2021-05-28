exports.getLoginDto = (request) => {
    const { cpf, matricula, senha } = request.body;
    let usuario = {};

    if (cpf) usuario.cpf = cpf.replace(/[\s.-]*/gim, '');
    if (matricula) usuario.matricula = matricula;
    if (senha) usuario.senha = senha;

    return usuario;
};

exports.getCadastroDto = (request) => {
    const { nome, email, cpf, senha } = request.body;
    let usuario = {};

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email?.toLowerCase();
    if (cpf) usuario.cpf = cpf.replace(/[\s.-]*/gim, '');
    if (senha) usuario.senha = senha;

    return usuario;
};
