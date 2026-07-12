#!/bin/sh
set -e

echo "Waiting for database..."
npx npx prisma migrate dev --name init
npx prisma db seed

exec npm run dev