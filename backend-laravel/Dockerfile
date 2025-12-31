FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN rm -f bootstrap/cache/*.php

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
