# ToolMaster Pro - Sistema de Gestión de Inventario

## Requisitos Previos
- [Node.js](https://nodejs.org/es) (versión 18 o superior)
- [Bun](https://bun.sh/) (opcional pero recomendado) o NPM.
- [Docker](https://www.docker.com/) (para levantar todo el entorno con un solo comando)

## Instrucciones para correr el Frontend localmente

Si deseas desarrollar o probar únicamente el Frontend en tu máquina local:

1. **Abre una terminal** y navega a la carpeta del frontend:
   ```bash
   cd frontend-app
   ```

2. **Instala las dependencias**:
   Usando NPM:
   ```bash
   npm install
   ```
   *(Si usas Bun: `bun install`)*

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** en la dirección indicada en la consola, típicamente `http://localhost:5174`.

> **Nota:** Para que el frontend funcione correctamente y puedas iniciar sesión, asegúrate de que el backend (API) y la Base de Datos estén corriendo. La forma más fácil de hacerlo es desde la carpeta principal del proyecto ejecutando: `docker-compose up -d`.

## Despliegue en Producción (Coolify / Docker)
El repositorio contiene la configuración exacta para desplegarse mediante Docker Compose. 
Simplemente vincula este repositorio a tu entorno de despliegue, asigna las variables de entorno (`DB_PASSWORD`, `JWT_SECRET`) y Docker construirá y enrutará los contenedores de Frontend, API y Postgres de forma automática.
