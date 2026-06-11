# Use the official PHP image with Apache
FROM php:8.2-apache

# Install PostgreSQL drivers (Required for Supabase)
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Enable Apache mod_rewrite (Optional but good for routing)
RUN a2enmod rewrite

# Copy your PHP files to the container
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html