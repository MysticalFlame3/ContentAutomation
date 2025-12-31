FROM php:8.2-apache

# Enable Apache rewrite
RUN a2enmod rewrite

# Install required system packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Set working directory
WORKDIR /var/www/html

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# Copy application code
COPY . .

# Ensure required directories
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    database

# Create SQLite database file
RUN touch database/database.sqlite

# Permissions
RUN chown -R www-data:www-data /var/www/html

# Laravel setup
RUN php artisan key:generate
RUN php artisan migrate --force

EXPOSE 80

CMD ["apache2-foreground"]
