<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with Docker and Prisma integration.

## Features

A API oferece as seguintes funcionalidades:

- **Autenticação JWT**: Proteção de rotas com autenticação baseada em JSON Web Tokens.
- **Registro de usuários**: Cadastro e login.
- **Listagem de jogos**: Obtenha uma lista de jogos com informações.
- **Busca de jogos**: Pesquisa de jogos por nome.
- **Paginação e filtros**: Suporte para paginação e filtros nas listagens.

## Project setup

### Using Docker

1. Certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados.
2. Para iniciar o projeto, execute o seguinte comando:

```bash
$ docker-compose up --build
```

Isso irá:

- Criar um container para o banco de dados PostgreSQL.
- Criar um container para a API NestJS.
- Rodar as migrações, gerando as tabelas no banco de dados.
- Rodar o projeto.

3. Acesse a API em: `http://localhost:3001`.

### Configuração do Prisma

1. Após iniciar o banco de dados com Docker, aplique as migrações do Prisma:

```bash
$ npx prisma migrate dev
```

2. Para visualizar o banco de dados, use o Prisma Studio:

```bash
$ npx prisma studio
```

3. O arquivo de configuração do Prisma (`prisma/schema.prisma`) já está configurado para usar o banco de dados PostgreSQL no container.

## Environment Variables

Certifique-se de configurar as seguintes variáveis no arquivo `.env` antes de iniciar o projeto:

### Variáveis obrigatórias

```env
# URL de conexão com o banco de dados PostgreSQL
DATABASE_URL=postgresql://<USUARIO>:<SENHA>@db:<PORTA>/<BANCO_DE_DADOS>

# URL da Api RAWG
RAWG_API_URL=<RAWG_API_URL>

#Chave de API RAWG
RAWG_API_KEY=<RAWG_API_KEY>

# Chave secreta para JWT (JSON Web Token)
TOKEN_SECRET=<SUA_CHAVE_SECRETA>
```

## Compile and run the project (sem Docker)

Se preferir rodar o projeto localmente sem Docker:

1. Instale as dependências:

```bash
$ npm install
```

2. Configure o banco de dados PostgreSQL localmente e atualize a variável `DATABASE_URL` no arquivo `.env`.

3. Aplique as migrações do Prisma:

```bash
$ npx prisma migrate dev
```

4. Inicie o servidor:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prisma

- Para gerar o cliente do Prisma após alterações no schema:

```bash
$ npx prisma generate
```

- Para criar uma nova migração:

```bash
$ npx prisma migrate dev --name <migration_name>
```

## Deployment

Para deploy em produção usando Docker:

1. Certifique-se de configurar as variáveis de ambiente no arquivo `.env`.
2. Execute o comando:

```bash
$ docker-compose -f docker-compose.prod.yaml up --build
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
