FROM node:21.7.1-bookworm AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY resources ./resources
COPY vite.config.js .
COPY .eslintrc.cjs .
RUN npm run lint
RUN npm run build

FROM php:8.3.3-cli-bookworm AS tests
RUN apt update && apt install -y unzip

RUN pecl install xdebug-3.3.1
RUN docker-php-ext-enable xdebug
ENV XDEBUG_MODE="coverage"

RUN curl https://getcomposer.org/download/2.7.2/composer.phar -o /usr/local/bin/composer
RUN chmod +x /usr/local/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-scripts
ENV APP_KEY=base64:b/X36sZl1xENbFcGjXDBZtjhdpEvTaVEdPrLhaFuZbc=
ENV APP_DEBUG=true
ENV APP_ENV=testing

COPY artisan .
COPY bootstrap ./bootstrap
COPY public ./public
COPY composer.json .
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY resources/views ./resources/views
COPY app ./app
COPY tests ./tests
COPY phpstan.neon .
COPY phpunit.xml .

RUN mkdir -p bootstrap/cache
RUN mkdir -p storage/framework/views
RUN touch .env
COPY --from=assets /app/public/build  ./public/build
RUN ./vendor/bin/phpstan analyse
RUN ./vendor/bin/phpunit
RUN composer install --no-dev


FROM php:8.3.3-apache-bookworm

RUN docker-php-ext-install mysqli pdo_mysql

RUN sed -i 's|html|html/public|' /etc/apache2/sites-available/000-default.conf
WORKDIR /var/www/html

COPY --from=tests /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

COPY artisan .
COPY bootstrap ./bootstrap
COPY public ./public
COPY composer.json .
COPY config ./config
COPY database ./database
COPY routes ./routes
COPY resources/views ./resources/views
COPY app ./app


RUN mkdir -p bootstrap/cache
RUN mkdir -p storage/framework/views
RUN mkdir -p /var/www/html/storage/logs

RUN chown -R www-data:www-data /var/www/html/storage/logs

ENV APP_DEBUG=no
ENV APP_ENV=production
RUN php artisan view:cache
ENV OAUTH_PROVIDER=https://accounts.google.com
ENV OAUTH_CLIENT_ID=290798039838-l5jssfu6gh4r66scp2bve1ki7p78l8jl.apps.googleusercontent.com

EXPOSE 80
ENTRYPOINT ["sh", "-c", "php artisan config:cache && php artisan migrate --force && apache2-foreground"]