#!/usr/bin/env bash

rm -rf php/vendor
rm -rf js/node_modules
rm -f php/composer.lock
rm -f js/package-lock.json
docker-compose rm -f
