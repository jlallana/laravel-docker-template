FROM node:21.7.1-bookworm AS npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM php:8.3.3-cli-bookworm AS composer
RUN apt update && apt install -y unzip
RUN curl https://getcomposer.org/download/2.7.2/composer.phar -o /usr/local/bin/composer
RUN chmod +x /usr/local/bin/composer

RUN pecl install xdebug-3.3.1
RUN docker-php-ext-enable xdebug
ENV XDEBUG_MODE="coverage"

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-scripts
ENV APP_KEY=base64:b/X36sZl1xENbFcGjXDBZtjhdpEvTaVEdPrLhaFuZbc=
ENV APP_DEBUG=true
ENV APP_ENV=testing
COPY . .
RUN mkdir -p bootstrap/cache
RUN mkdir -p storage/framework/views
RUN touch .env
COPY --from=npm /app/public/build  ./public/build
RUN ./vendor/bin/phpstan analyse
RUN ./vendor/bin/phpunit
RUN composer install --no-dev


FROM php:8.3.3-apache-bookworm

RUN docker-php-ext-install mysqli pdo_mysql

RUN sed -i 's|html|html/public|' /etc/apache2/sites-available/000-default.conf
WORKDIR /var/www/html

COPY --from=composer /app/vendor ./vendor
COPY --from=npm /app/public/build ./public/build
COPY . .
RUN touch .env

RUN mkdir -p bootstrap/cache
RUN mkdir -p storage/framework/views
RUN mkdir -p /var/www/html/storage/logs

RUN chown -R www-data:www-data /var/www/html/storage/logs

ENV APP_DEBUG=false
ENV APP_ENV=production
RUN php artisan view:cache

EXPOSE 80
ENTRYPOINT ["sh", "-c", "php artisan config:cache && php artisan migrate --force && apache2-foreground"]