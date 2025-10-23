# Imagen base
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del backend
COPY . .

# Exponer puerto del backend
EXPOSE 3000

# Comando para correr el backend
CMD ["node", "src/index.js"]
