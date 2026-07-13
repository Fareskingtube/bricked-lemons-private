# Bricked Lemons

## Introduction

**Bricked Lemons** is a website about a non-existent company that takes old useless computer parts **(Lemons)** and refurbishes them into fully operation and **premium gaming components** for your next PC build.

## Tech Stack

#### **Frontend:**

- Vite (To set up the project)
- React (The frontend framework)
- Tailwind CSS (Just an overall help with styling)
- Typescript (For Typing)

#### **Backend:**

- Express (The backend framework)
- PostgreSQL (The database that stores all the users and products)
- Prisma (The ORM we're using instead of writing plain SQL queries and for seeding and setting up schema)
- Jest & Supertest (For testing)
- Typescript (For Typing)

#### **Shared:**

- Docker (For standardizing the project environment and setting up a postgreSQL database)

## Setup

### Via Docker **(Recommended)**

#### **Prerequisites:**

- Have [Git](https://git-scm.com/) installed
- Have [Docker](https://www.docker.com/get-started/) installed

#### **Quick Start:**
Run: 
```sh
git clone https://github.com/Fareskingtube/bricked-lemons-private.git
cd bricked-lemons-private
cp ./backend/.example.env ./backend/.env
cp ./frontend/.example.env ./frontend/.env
```

Open the `.env` files in both `/frontend` and `/backend` directories and set the variables accordingly

Run:
```sh
docker compose up -d --build
```

Now if you open up `http://localhost:5173/` You should see the home page and that everything is working

### Native (Windows)
#### **Prerequisites:**

- Have [Git](https://git-scm.com/) installed
- Have [NodeJS](https://nodejs.org/) v24.11.1 or higher installed

Run:
```sh
git clone https://github.com/Fareskingtube/bricked-lemons-private.git
cd bricked-lemons-private
cp ./backend/.example.env ./backend/.env
cp ./frontend/.example.env ./frontend/.env
```

Open the `.env` files in both `/frontend` and `/backend` directories and set the variables accordingly **(Especially the `DATABASE_URL` in `/backend/.env`)**

Run:
```sh
# Start the backend server
cd backend
npm i
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run build
npm run start

# Start the frontend server
cd ../frontend
npm i
npm run build
npm run start
```
Now if you open up `http://localhost:5173/` You should see the home page and that everything is working
