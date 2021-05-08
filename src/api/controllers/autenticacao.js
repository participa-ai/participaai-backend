const crypto = require('crypto');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');
const Usuario = require('../../models/Usuario');
const { validateCpf } = require('../../utils/helpers/userHelper');

class AutenticacaoController {
    cadastro = asyncHandler(async (request, response, next) => {
        const { nome, email, cpf, senha } = request.body;
        const tipo = 'cidadao';

        if (!validateCpf(cpf)) {
            return next(
                new ErrorResponse(
                    `Erro no cadastro, CPF inválido.`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        const usuario = await Usuario.create({
            nome,
            email,
            cpf,
            senha,
            tipo,
        });

        this.sendTokenResponse(usuario, StatusCodes.OK, response);
    });

    login = asyncHandler(async (request, response, next) => {
        const { cpf, matricula, senha } = request.body;

        if ((cpf && matricula) || !(cpf || matricula) || !senha) {
            return next(
                new ErrorResponse(
                    `Credenciais inválidas`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        let usuario;
        if (cpf) {
            usuario = await Usuario.findOne({ cpf }).select('+senha');
        } else if (matricula) {
            usuario = await Usuario.findOne({ matricula }).select('+senha');
        }

        if (!usuario) {
            return next(
                new ErrorResponse(
                    `Credenciais inválidas`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        const isMatch = await usuario.matchPassword(senha);

        if (!isMatch) {
            return next(
                new ErrorResponse(
                    `Credenciais inválidas`,
                    StatusCodes.UNAUTHORIZED
                )
            );
        }

        this.sendTokenResponse(usuario, StatusCodes.OK, response);
    });

    getEu = asyncHandler(async (request, response, next) => {
        const usuario = await Usuario.findById(request.usuario.id);

        return response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    logout = asyncHandler(async (request, response, next) => {
        this.clearTokenResponse(StatusCodes.OK, response);
    });

    alterarSenha = asyncHandler(async (request, response, next) => {
        const { senhaAtual, senhaNova } = request.body;

        const usuario = await Usuario.findById(request.usuario.id).select(
            '+senha'
        );

        const isMatch = await usuario.matchPassword(senha);
        if (!isMatch) {
            return next(
                new ErrorResponse(
                    `Senha atual inválida`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        usuario.senha = senhaNova;
        await usuario.save();

        response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    sendTokenResponse = (usuario, statusCode, response) => {
        const token = usuario.getSignedJwtToken();

        const options = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        response
            .status(statusCode)
            // .cookie('token', token, options)
            .json(new JsonResponse({ token }));
    };

    clearTokenResponse = (statusCode, response) => {
        const token = '';

        const options = {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        };

        response
            .status(statusCode)
            .cookie('token', token, options)
            .json(new JsonResponse({ token }));
    };
}

module.exports = new AutenticacaoController();
