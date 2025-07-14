# backend-polvinho

## 📦 Requisitos

- [Node.js](https://nodejs.org/) v24.1.0 
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node)
- [MongoDB](https://www.mongodb.com/) (instância local ou em nuvem)
- ⚠️ Alternativamente, você pode usar Docker para rodar o projeto sem instalar Node ou MongoDB localmente.

## 🛠 Banco de Dados - MongoDB

Este projeto utiliza o **MongoDB** como banco de dados. Você pode:

- Rodar o MongoDB localmente (por exemplo, com `mongod` instalado em sua máquina);
- Ou usar uma instância em nuvem como o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Ou ainda usar o Docker (veja a seção abaixo).

## 🚀 Como rodar o projeto

Siga os passos abaixo para clonar e executar o projeto localmente.

### 1. Clonar o repositório

```bash
git clone https://github.com/pmarchiori/backend-polvinho.git
cd backend-polvinho
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com as configurações necessárias. Exemplo:

```bash
MONGO_URL=mongodb://localhost:27017/banco-de-dados
PORT=7000
JWT_SECRET=chave-secreta
```

### 4. Popular o banco de dados com dados de teste

```bash
npm run seed
```

Esse comando irá criar registros iniciais no banco de dados para facilitar os testes locais.

### 5. Iniciar o servidor

```bash
npm start
```

## 🐳 Usando Docker
Caso prefira rodar o projeto com Docker, siga os passos abaixo. Isso irá iniciar os containers do MongoDB e da aplicação Node.js.


### 1. Certifique-se de que o Docker e Docker Compose estão instalados
[Instalar Docker Desktop](https://docs.docker.com/desktop/)


### 2. Configurar o arquivo .env
Crie um arquivo .env com o seguinte conteúdo (ou use o .env.example como base):
```bash
PORT=8000
MONGO_URL=mongodb://mongo:27017/polvinho
JWT_SECRET=secret-jwt
```


### 3. Subir os containers

```bash
docker-compose up -d
```
Isso iniciará os serviços backend e mongo. 


### 4. Popular o banco de dados
Com os containers rodando, execute o comando de seed dentro do container:

```bash
docker-compose exec backend npm run seed
```

## Estrutura do projeto 

```bash
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── server.js
```
