# :rocket: participaai-backend

Participa ai! - Backend Repo

## :books: Documentação

Acesse a documentação: https://documenter.getpostman.com/view/15223886/TzCQaRr8

## :anchor: Padronização

-   Padronização das rotas:
    `<url>/api/usuarios/:id/alterar-senha`
    -   restful
    -   "api" prefix
    -   plural
    -   spinal case

## :construction: Rotas

    /autenticacao
        POST 	/login
        GET 	/logout
        POST 	/cadastro
        GET  	/eu
        POST 	/esqueci-senha
        POST 	/alterar-senha

    /usuarios/
        GET 	/
        POST 	/
        POST 	/filtrar
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id

    /categorias
        GET 	/
        POST 	/
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id
        GET 	/meus-problemas/

    /problemas
        GET 	/
        POST 	/
        POST 	/filtrar
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id
        POST 	/:id/upload-foto

    /dados-dashboard
        GET     /

#### Response Convention

-   Success Tag

    ```
    {
        // Indica se a requisição foi executada com successo
        "success": true,
        ...
    }
    ```

-   Meta Section

    ```
    {
        ...
        // Traz informações sobre a resposta, tipo de dados, paginação
        "metadata": {
            // Tipo de dados no retorno
            "type": "list|object|error",
            // Quantidade total de objetos
            "count": 10,
            // Paginação
            "pagination": {
                "current": 4,
                "previous": 3,
                "next": 5,
                // Quantidade de objetos por página
                "limit": 2
            }
        },
        ...
    }
    ```

-   Data Section

    ```
    {
        ...
        // A seção de dados retorna os dados em lista, ou objeto unico
        // list
        "data": [
            {
                "_id": "1235",
                "nome": "ana teste"
            },
            {
                "_id": "1234",
                "nome": "bob teste"
            }
        ]
        // ou object
        "data": {
            "_id": "1234",
            "nome": "bob teste"
        }

    }
    ```

#### Examples

-   Successful Paginated Querying `GET`

    ```
    > /api/users?tipo=cidadao&select=nome&sort=nome&page=4&limit=2
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "list",
            "pagination": {
                "current": 1,
                "next": 2,
                "limit": 2
            },
            "count": 10
        },
        "data": [
            {
                "_id": "1235",
                "nome": "ana teste"
            },
            {
                "_id": "1234",
                "nome": "bob teste"
            }
        ]
    }
    ```

-   Successful normal `GET`
    ```
    > /api/usuarios
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "list",
            "count": 10
        },
        "data|result": [
            {
                "_id": "1235",
                "nome": "ana teste"
            },
            {
                "_id": "1234",
                "nome": "bob teste"
            },
            ...
        ]
    }
    ```
-   Successful Single `GET`

    ```
    > /api/usuarios/1234
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "object"
        },
        "data": {
            "_id": "1234",
            "nome": "bob teste"
        }
    }
    ```

-   Failed Single `GET`
    ```
    > /api/usuarios/1236
    > 404 NOT FOUND
    {
        "success": false,
        "metadata": {
            "type": "error"
        },
        "data": {
            "message": "Não existe usuário para o id 1236"
        }
    }
    ```
-   Successful Create `POST`
    ```
    > /api/usuarios/
    > 201 CREATED
    {
        "success": true,
        "metadata": {
            "type": "object"
        },
        // Retorna o objeto com os dados processados e o id criado
        "data": {
            "_id": "1234",
            "nome": "bob teste"
        }
    }
    ```
-   Successful Update `PUT`

    ```
    > /api/usuarios/1234
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "object"
        },
        // Retorna o objeto com os dados atualizados
        "data": {
            "_id": "1234",
            "nome": "bob teste"
        }
    }
    ```

-   Successful `DELETE`

    ```
    > /api/usuarios/1234
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "object"
        },
        // Retorno vazio
        "data": {}
    }
    ```

-   Dashboard `GET`
    ```
    > /api/dados-dashboard
    > 200 OK
    {
        "success": true,
        "metadata": {
            "type": "object"
        },
        "data": {
            "totalDeProblemas": 69,
            "problemasRespondidos": 42,
            "problemasPorCategoria": [
                {
                    "_id_": "buracoNaVia",
                    "quantidade": "2"
                },
                {
                    "_id_": "posteQueimado",
                    "quantidade": "1"
                }
            ],
            "problemasPorDia": [
                {
                    "_id_": "2021-04-01",
                    "quantidade": "50"
                },
                {
                    "_id_": "2021-04-02",
                    "quantidade": "1"
                },
                {
                    "_id_": "2021-04-04",
                    "quantidade": "2"
                }
            ]
        }
    }
    ```
