const crypto = require('crypto');
const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');
const Usuario = require('../../models/Usuario');

class AutenticacaoController {
    cadastro = asyncHandler(async (request, response, next) => {
        const { nome, email, cpf, matricula, senha, tipo } = request.body;

        const usuario = await Usuario.create({
            nome,
            email,
            cpf,
            matricula,
            senha,
            tipo,
        });

        this.sendTokenResponse(usuario, StatusCodes.OK, response);
    });

    login = asyncHandler(async (request, response, next) => {
        console.log(request.body);
        const { cpf, matricula, senha } = request.body;

        console.log('1');
        if ((cpf && matricula) || !(cpf || matricula) || !senha) {
            return next(
                new ErrorResponse(
                    `Credenciais inválidas`,
                    StatusCodes.BAD_REQUEST
                )
            );
        }

        console.log('2');
        let usuario;
        if (cpf) {
            usuario = await Usuario.findOne({ cpf }).select('+senha');
        } else if (matricula) {
            usuario = await Usuario.findOne({ matricula }).select('+senha');
        }
        console.log(usuario);

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
        return response.status(StatusCodes.OK).json({
            sucess: true,
            data: usuario,
        });
    });

    logout = asyncHandler(async (request, response, next) => {
        this.clearTokenResponse(StatusCodes.OK, response);
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
            .json({
                sucess: true,
                token,
            });
    };

    clearTokenResponse = (statusCode, response) => {
        const token = '';

        const options = {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        };

        response.status(statusCode).cookie('token', token, options).json({
            sucess: true,
            token,
        });
    };
}

module.exports = new AutenticacaoController();
