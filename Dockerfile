# Usar la imagen oficial de NGINX
FROM nginx:latest

# Copiar tu script njs al lugar correcto dentro del contenedor
COPY sensor.js /etc/nginx/njs/sensor.js

# Copiar tu archivo de configuración para que reemplace el de por defecto
COPY nginx.conf /etc/nginx/nginx.conf