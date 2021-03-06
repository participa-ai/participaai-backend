const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

const Usuario = require('../../models/Usuario');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const { validateCpf } = require('../../utils/helpers/userHelper');
const {
    getLoginDto,
    getCadastroDto,
} = require('../../utils/helpers/authHelper');
const { sendEmail } = require('../../utils/services/mailer');

class AutenticacaoController {
    cadastro = asyncHandler(async (request, response, next) => {
        const cadastroDto = getCadastroDto(request);
        const { nome, email, cpf, senha } = cadastroDto;
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

        usuario.senha = undefined;

        this.sendTokenResponse(usuario, StatusCodes.OK, response);
    });

    login = asyncHandler(async (request, response, next) => {
        const loginDto = getLoginDto(request);
        const { cpf, matricula, senha } = loginDto;

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

        usuario.senha = undefined;

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

        const isMatch = await usuario.matchPassword(senhaAtual);
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

        this.clearTokenResponse(StatusCodes.OK, response);
    });

    esqueciSenha = asyncHandler(async (request, response, next) => {
        const usuario = await Usuario.findOne({
            email: request?.body?.email?.toLowerCase(),
        });

        if (!usuario) {
            return next(
                new ErrorResponse(
                    'Não existe usuário cadastrado para esse email.',
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        const resetToken = usuario.getResetToken();

        const message = `Você está recebendo esse email porque você (ou alguém) solicitou uma recuperação de senha.\nSua nova senha para acesso é: ${resetToken}`;

        try {
            await sendEmail({
                email: usuario.email,
                subject: 'Participa-aí! Solicitação de recuperação de senha',
                message,
            });

            await usuario.save({ validateBeforeSave: false });

            response
                .status(StatusCodes.OK)
                .json(new JsonResponse({ mensagem: 'Email enviado' }));
        } catch (error) {
            console.error(error);

            return next(new ErrorResponse('Falha ao enviar email', 500));
        }
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
            .json(new JsonResponse({ token, usuario }));
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
            .json(new JsonResponse({ token, usuario: {} }));
    };
}

module.exports = new AutenticacaoController();
