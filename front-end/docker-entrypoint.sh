#!/bin/bash

# Set permission
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Lanjut jalankan php-fpm
exec php-fpm
