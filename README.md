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
- Definir as funcionalidades que desejo desde o início do projeto para ganhar eficiência

## Próximos Passos

Atualmente, o projeto está focado no desenvolvimento do backend, com planos para expandir e desenvolver o frontend. Com isso, pretendo oferecer uma experiência completa e integrada aos usuários, facilitando o acesso e a utilização da plataforma.

## Fazendo Requisições HTTP para a API

Utilize a coleção que preparei com todas as requisições para testar a API

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/29144337-fe203eb9-9c0b-4130-9c3c-868f64673126?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D29144337-fe203eb9-9c0b-4130-9c3c-868f64673126%26entityType%3Dcollection%26workspaceId%3Dbd44a99e-94d6-477f-b0e3-25653fbccb2e)

ou

Para fazer requisições para a API, utilize o seguinte URL base: `https://sustainablehabits.onrender.com/`

com as rotas abaixo

### User Routes ('/users')

- **POST** `/register`: Registrar um novo usuário
- **POST** `/login`: Fazer login
- **POST** `/logout`: Fazer logout
- **GET** `/profile`: Obter perfil do usuário
- **PUT** `/profile`: Atualizar perfil do usuário

### Habit Routes ('/habits')

- **GET** `/`: Obter todos os hábitos
- **GET** `/:id`: Obter um hábito específico
- **GET** `/progress`: Obter o progresso de todos os hábitos
- **GET** `/:id/progress`: Obter o progresso de um hábito específico
- **POST** `/:id`: Adotar um hábito
- **DELETE** `/:id`: Abandonar um hábito
- **PUT** `/:id/:milestone`: Atualizar um marco de um hábito
- **POST** `/:id/comment`: Comentar sobre um hábito
- **PUT** `/:id/comment/:commentId`: Editar um comentário sobre um hábito
- **DELETE** `/:id/comment/:commentId`: Excluir um comentário sobre um hábito
- **GET** `/:id/comment`: Mostrar todos os comentários sobre um hábito

## Contribuições

Você pode contribuir para o **Sustainable Habits** de diversas formas, como:

- Testando o sistema e relatando bugs ou problemas encontrados.
- Sugerindo novas funcionalidades ou melhorias.
- Participando ativamente da comunidade e compartilhando suas ideias.
- Contribuindo com o desenvolvimento do frontend, backend ou documentação.

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE), o que significa que você é livre para usar, modificar e distribuir o código conforme desejar. Sua contribuição é sempre bem-vinda!
