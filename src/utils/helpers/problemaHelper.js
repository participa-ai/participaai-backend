exports.getProblemaDto = (request) => {
    const {
        usuario,
        categoria,
        descricao,
        localizacao,
        foto,
        status,
        resposta,
    } = request.body;
    const problema = {};

    if (usuario) problema.usuario = usuario;
    if (categoria) problema.categoria = categoria;
    if (descricao) problema.descricao = descricao;
    if (status) problema.status = status;

    if (localizacao) {
        problema.localizacao = {};
        if (localizacao.coordinates)
            problema.localizacao.coordinates = localizacao.coordinates;
    }

    if (foto) {
        problema.foto = {};
        if (foto.nome) problema.foto.nome = foto.nome;
        if (foto.uri) problema.foto.uri = foto.uri;
    }

    if (resposta) {
        problema.resposta = {};
        if (resposta.descricao)
            problema.resposta.descricao = resposta.descricao;
        if (resposta.data) problema.resposta.data = resposta.data;
        if (resposta.usuario) problema.resposta.usuario = resposta.usuario;
    }

    return problema;
};

exports.getProblemaDtoForInsert = (request) => {
    let problema = this.getProblemaDto(request);

    if (problema.foto) delete problema.foto;
    if (problema.status) delete problema.status;
    if (problema.resposta) delete problema.resposta;

    return problema;
};
