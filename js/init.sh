#!/bin/sh

if [ ! -f /app/package-lock.json ]; then
    echo "Installing Node packages, please wait ..."
    npm install &
fi

until [ -f /app/package-lock.json ]
do
    echo "..."
    sleep 2
done

npm run --silent lint
npm run --silent test
