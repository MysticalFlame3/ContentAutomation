FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (important for caching)
COPY composer.json composer.lock ./

# Install PHP dependencies WITHOUT running scripts
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy rest of the application
COPY . .

# Ensure required directories exist
RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache

# Ensure SQLite DB exists
RUN mkdir -p database && touch database/database.sqlite

# Generate app key AFTER files exist
RUN php artisan key:generate

# Run migrations
RUN php artisan migrate --force

# Expose Render port
EXPOSE 10000

# Start Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
