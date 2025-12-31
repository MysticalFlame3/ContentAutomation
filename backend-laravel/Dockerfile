FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader

COPY . .

RUN mkdir -p storage/framework/{cache,sessions,views} \
    bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD php -S 0.0.0.0:$PORT -t public
