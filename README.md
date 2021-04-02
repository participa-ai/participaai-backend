# participaai-backend
Participa ai! - Backend Repo

#### Padronização

-   Padronização das rotas:
    `<url>/api/users/:id/update-password`
    -   restful
    -   "api" prefix
    -   plural
    -   spinal case

#### Rotas

    /auth
        POST 	/signin
        GET 	/signout
        POST 	/signup
        GET  	/me
        POST 	/forgot-password

    /users/
        GET 	/
        POST 	/
        POST 	/filter
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id
        GET 	/:id/complaints
        GET 	/complaints
        POST 	/:id/update-password
        POST 	/update-password

    /complaint-categories
        GET 	/
        POST 	/
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id

    /complaints
        GET 	/
        POST 	/
        POST 	/filter
        PUT 	/:id
        DELETE 	/:id
        GET 	/:id
        POST 	/:id/answer
        GET 	/:id/answer (?)
        POST	/:id/images (?)
        POST	/:id/answer/:id/images (?)

#### Response Convention

-   Sucess Tag

    ```
    {
        // Indica se a requisição foi executada com sucesso
        "sucess": true,
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
                "name": "ana teste"
            },
            {
                "_id": "1234",
                "name": "bob teste"
            }
        ]
        // ou object
        "data": {
            "_id": "1234",
            "name": "bob teste"
        }

    }
    ```

#### Examples

-   Successful Paginated Querying `GET`

    ```
    > /api/v1/users?role=client&age[gt]=18&page=4&select=name&sort=name&limit=1
    > 200 OK
    {
        "sucess": true,
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
                "name": "ana teste"
            },
            {
                "_id": "1234",
                "name": "bob teste"
            }
        ]
    }
    ```

-   Successful normal `GET`
    ```
    > /api/v1/users
    > 200 OK
    {
        "sucess": true,
        "metadata": {
            "type": "list",
            "count": 10
        },
        "data|result": [
            {
                "_id": "1235",
                "name": "ana teste"
            },
            {
                "_id": "1234",
                "name": "bob teste"
            },
            ...
        ]
    }
    ```
-   Successful Single `GET`

    ```
    > /api/v1/users/1234
    > 200 OK
    {
        "sucess": true,
        "metadata": {
            "type": "object"
        },
        "data": {
            "_id": "1234",
            "name": "bob teste"
        }
    }
    ```

-   Failed Single `GET`
    ```
    > /api/v1/users/1236
    > 404 NOT FOUND
    {
        "sucess": false,
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
    > /api/v1/users/
    > 201 CREATED
    {
        "sucess": true,
        "metadata": {
            "type": "object"
        },
        // Retorna o objeto com os dados processados e o id criado
        "data": {
            "_id": "1234",
            "name": "bob teste"
        }
    }
    ```
-   Successful Update `PUT`

    ```
    > /api/v1/users/1234
    > 200 OK
    {
        "sucess": true,
        "metadata": {
            "type": "object"
        },
        // Retorna o objeto com os dados atualizados
        "data": {
            "_id": "1234",
            "name": "bob teste"
        }
    }
    ```

-   Successful `DELETE`
    ```
    > /api/v1/users/1234
    > 200 OK
    {
        "sucess": true,
        "metadata": {
            "type": "object"
        },
        // Retorno vazio
        "data": {}
    }
    ```
