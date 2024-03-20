# Entorno de desarrolla laravel+vite+vue+docker


docker compose up --build -d

## resumen de comando utiles

```bash
# iniciar todos los servicios
docker compose up --build

# ejecutar comando de artisan
docker compose exec artisan php arsitan <comando-de-artisan>

# ejecutar migraciones limpiando la base de datos
docker compose exec artisan php arsitan migrate:fresh --seed

# agregar dependencia de composer
docker compose exec artisan composer install <package-name>

# agregar dependencia de npm
docker compose exec vite npm install <package-name>

# ejecutar las validaciones de calidad de codigo php manualmente
docker compose exec artisan vendor/bin/phpstan

# ejecutar las validaciones de calidad de codigo javascript manualmente
docker compose exec vite npm run lint

# ejecutar las pruebas unitarias manualmente
docker compose exec artisan vendor/bin/phpunit

```

# Descripcion de los servicios

## artisan

Ese servicio ejecuta un "php artisan serve".

Este servicio esta disponble en http://localhost:8080.

Con vite se le da soporte al proyecto para cargar una aplicacion vue.js

El mismo tiene un volumen montado, por lo cual, cualquier cambio en el código fuente se aplica de inmediato.

El mismo tiene soporte de depuración.Se debe iniciar la depuración en el IDE, y luego en el navegador tambien habilitarlo. Se utiliza XDebug3.

Al iniciar ejecuta un "composer install" y "artisan migrate" para inicializar la aplicación.

Como base de datos, utiliza una base de datos SQLite ubicada en database/database.sqlite

Se puede ejecutar comando dentro del contenedor para por ejemplo, agregar paquetes de composer.

Para ejecutar un comando en el contenedor debe ejecutarse "docker compose exec artisan {comoando-a-ejecutar} {parametros-del-comando}"

## vite

Este servicio ejecuta un "npm run dev"

El mismo esta disponible en http://localhost:5173.

Este servicio tiene la finalidad de mantener los recursos de la aplicacion compilados en tiempo real.

Al iniciar ejecuta automaticamente con "npm install"

Esta imagen se puede utilizar para agregar paquetes de npm ejecutando comandos dentro del contenedor.

Para el mismo se puede usar el comando "docker compose exec vite {comando-de-npm}"

## mysql

En este servicio se ejecuta una base de datos mysql, para poder realizar pruebas de entornos clones de productivo.

Se puede conectar a la base de datos con estas credenciales. Usuario mysql_user, contreseña mysql_password, base de datos "mysql_database" y el host "localhost:3306"

## apache

En este servicio se ejecuta un apache en modo productivo.

Se puede acceder al servicio por http://localhost

Ese servicio realiza varias operaciones antes de iniciar.

Primero ejecuta todos los test, tanto unitarios como de integracion utilzando SQLite. Luego realiza pruebas de calidad de código con PHPStan.

Ese servicio realiza una copia del codigo fuente dentro del contenedor. Descarga dependencias con composer install y npm install.

Compila todos los recursos de manera estatica para no requerir un servidor de vite.

Inicia conectandose a la base de datos MySQL.

Para actualizar las fuentes de este servidor es necesario reconstruir el contenedor, tal como se hace en un servidor productivo.