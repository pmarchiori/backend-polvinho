# Etapa 1: imagem base
FROM node:24.1.0

# Etapa 2: diretório de trabalho
WORKDIR /app

# Etapa 3: copiar os arquivos
COPY package*.json ./
RUN npm install

COPY . .

# Etapa 4: expor a porta
EXPOSE 8000

# Etapa 5: comando para rodar
CMD ["npm", "run", "start"]
