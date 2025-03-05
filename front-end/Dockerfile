# Frontend Build Stage
FROM node:18 AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . /app
RUN npm run build

# Laravel PHP Container
FROM php:8.2-fpm
WORKDIR /var/www

# Install dependencies for PHP
RUN apt-get update && apt-get install -y \
    git unzip curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel application (now correctly structured)
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy built frontend assets from frontend-builder
COPY --from=frontend-builder /app/public/build public/build

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
