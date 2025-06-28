FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY metro.config.js ./
COPY jest.config.js ./
COPY .eslintrc.js ./
COPY .prettierrc ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Comando padrão
CMD ["npm", "start"] 