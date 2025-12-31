FROM php:8.4-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    sqlite3 \
    libsqlite3-dev

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# ⬅️ COPY FULL APP FIRST (THIS FIXES EVERYTHING)
COPY . .

# Install dependencies (artisan now exists)
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Ensure required directories
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    database

# Create SQLite DB
RUN touch database/database.sqlite

RUN chown -R www-data:www-data /var/www/html

# Laravel setup
RUN php artisan key:generate
RUN php artisan migrate --force

EXPOSE 80
CMD ["apache2-foreground"]
