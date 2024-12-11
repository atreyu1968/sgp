FROM node:20-alpine as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Crear directorio para la base de datos y asignar permisos
RUN mkdir -p /app/data && chown -R node:node /app/data

# Copiar archivos necesarios
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Instalar solo las dependencias de producción
RUN npm ci --omit=dev

# Cambiar al usuario node por seguridad
USER node

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3010
ENV DB_URL=file:/app/data/local.db

# Exponer puerto
EXPOSE 3010

# Comando para iniciar
CMD ["npm", "start"]