exports.getCategoriaDto = (request) => {
    const { nome } = request.body;
    const categoria = {};

    if (nome) categoria.nome = nome;

    return categoria;
};
