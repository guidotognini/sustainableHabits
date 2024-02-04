# Sustainable Habits

**Sustainable Habits** é um projeto para promover hábitos sustentáveis no dia a dia, visando um impacto positivo no meio ambiente e na sociedade.

## Funcionalidades

- Cadastro de usuários e definição de desafios pessoais.
- Acompanhamento do progresso individual.
- Interatividade na Comunidade através de comentários.

## Tecnologias

- JavaScript
- Node.js
- Express.js
- JWT
- PostgreSQL
- bcrypt
- Sequelize (ORM) 
- AsyncHandler


## Aprendizados

### Técnicos
- Configuração de servidor e definição de rotas
- Autenticação de usuários
- Design de banco de dados e relações entre tabelas
- Utilização de ORM para simplificação de consultas e ações no banco de dados
- Encriptografia
- Manipulação de erros
- Deploy

### Habilidades
- Resiliência na busca de soluções
- Paciência para debugar e entender o passo a passo para encontrar o problema
- Definir as funcionalidades que desejo no início do projeto para ganhar eficiência

## Próximos Passos

Atualmente, o projeto está focado no desenvolvimento do backend, com planos para expandir e desenvolver o frontend. Com isso, pretendo oferecer uma experiência completa e integrada aos usuários, facilitando o acesso e a utilização da plataforma.

## Fazendo Requisições HTTP para a API

Para fazer requisições para a API, utilize o seguinte URL base: `https://sustainablehabits.onrender.com/`

### Sugestões de Aplicativos para Fazer Requisições:

- **Postman**: Um aplicativo de desenvolvimento colaborativo para fazer requisições HTTP.
  [Postman Website](https://www.postman.com/)

- **ReqBin**: Um site onde você pode fazer requisições HTTP online diretamente do seu navegador.
  [ReqBin Website](https://reqbin.com/)

### Habit Routes

1. **Obter todos os hábitos**
   - **Método**: `GET`
   - **Endpoint**: `/`

2. **Obter um hábito específico**
   - **Método**: `GET`
   - **Endpoint**: `/:id`

3. **Obter o progresso de todos os hábitos**
   - **Método**: `GET`
   - **Endpoint**: `/progress`

4. **Obter o progresso de um hábito específico**
   - **Método**: `GET`
   - **Endpoint**: `/:id/progress`

5. **Adotar um hábito**
   - **Método**: `GET`
   - **Endpoint**: `/:id`

6. **Abandonar um hábito**
   - **Método**: `DELETE`
   - **Endpoint**: `/:id`

7. **Atualizar um marco de um hábito**
   - **Método**: `PUT`
   - **Endpoint**: `/:id/:milestone`

8. **Comentar sobre um hábito**
   - **Método**: `POST`
   - **Endpoint**: `/:id/comment`
   - **Corpo da Requisição**:
     ```json
     {
       "comment": "<comment>"
     }
     ```

9. **Editar um comentário sobre um hábito**
   - **Método**: `PUT`
   - **Endpoint**: `/:id/comment/:commentId`
   - **Corpo da Requisição**:
     ```json
     {
       "comment": "<comment>"
     }
     ```

10. **Excluir um comentário sobre um hábito**
    - **Método**: `DELETE`
    - **Endpoint**: `/:id/comment/:commentId`

11. **Mostrar todos os comentários sobre um hábito**
    - **Método**: `GET`
    - **Endpoint**: `/:id/comment`

### User Routes

12. **Registrar um novo usuário**
    - **Método**: `POST`
    - **Endpoint**: `/register`
    - **Corpo da Requisição**:
      ```json
      {
        "username": "<username>",
        "email": "<email>",
        "password": "<password>"
      }
      ```

13. **Fazer login**
    - **Método**: `POST`
    - **Endpoint**: `/login`
    - **Corpo da Requisição**:
      ```json
      {
        "username": "<username>",
        "password": "<password>"
      }
      ```

14. **Fazer logout**
    - **Método**: `POST`
    - **Endpoint**: `/logout`

15. **Obter perfil do usuário**
    - **Método**: `GET`
    - **Endpoint**: `/profile`

16. **Atualizar perfil do usuário**
    - **Método**: `PUT`
    - **Endpoint**: `/profile`
    - **Corpo da Requisição**:
      ```json
      {
        "username": "<username>",
        "email": "<email>"
      }
      ```



## Contribuições

Você pode contribuir para o **Sustainable Habits** de diversas formas, como:

- Testando o sistema e relatando bugs ou problemas encontrados.
- Sugerindo novas funcionalidades ou melhorias.
- Participando ativamente da comunidade e compartilhando suas ideias.
- Contribuindo com o desenvolvimento do frontend, backend ou documentação.

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE), o que significa que você é livre para usar, modificar e distribuir o código conforme desejar. Sua contribuição é sempre bem-vinda!
