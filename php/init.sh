#!/bin/sh

if [ ! -f /app/composer.lock ]; then
    echo "Installing Composer packages, please wait ..."
fi

until [ -f /app/composer.lock ]
do
    echo "..."
    sleep 2
done

if [ ! -f /app/vendor/squizlabs/php_codesniffer/CodeSniffer.conf ]; then
    vendor/bin/phpcs --config-set colors 1
    vendor/bin/phpcs --config-set default_standard PSR2
fi

vendor/bin/phpcs src/
vendor/bin/phpcs tests/
vendor/bin/phpunit --colors=always tests/*
