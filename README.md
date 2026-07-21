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
- A Gmail address with **app** password ([Get from Here](https://nodejs.org/https://myaccount.google.com/apppasswords))
- [Cloudflare R2 Bucket](#cloudflare-r2-bucket-setup)

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
- A Gmail address with **app** password ([Get from Here](https://nodejs.org/https://myaccount.google.com/apppasswords))
- [Cloudflare R2 Bucket](#cloudflare-r2-bucket-setup)
- [PostgreSQL](https://www.postgresql.org/) Database (**Local** or **Remote**)
- [MongoDB](https://www.mongodb.com/) Database (**Local** or **[Remote](https://www.mongodb.com/products/platform/atlas-database)**)

Run:

```sh
git clone https://github.com/Fareskingtube/bricked-lemons-private.git
cd bricked-lemons-private
cp ./backend/.example.env ./backend/.env
cp ./frontend/.example.env ./frontend/.env
```

Open the `.env` files in both `/frontend` and `/backend` directories and set the variables accordingly **(Especially `/backend/.env`)**

Run:

```sh
# Start the backend server
cd backend
npm i
npm run generate
npm run migrate
npm run seed:pg
npm run build
npm run start

# Start the frontend server
cd ../frontend
npm i
npm run build
npm run start
```

Now if you open up `http://localhost:5173/` You should see the home page and that everything is working

## Cloudflare R2 Bucket Setup

### Creating Bucket

1. Go to [Cloudflare website](https://www.cloudflare.com/) and **Login** or **Register** to an account
1. Go to your [dashboard](https://dash.cloudflare.com/)
1. Click on Sidebar -> Build -> Storage & Databases -> R2 Object Storage -> Overview
1. Create a bucket
1. On Overview -> Account Details -> API Tokens -> Manage
1. Create **Account API token** with settings:
   - Object **Read & Write**: Allows the ability to read, write, and list objects in specific buckets.
   - Apply to a specific buckets only (Set it yo the bucket you just created)
1. Take the **API Credentials** and put them in the `/backend/.env`
1. Go back into your **bucket** -> Settings -> CORS Policy
1. Click `+ Add` and set CORS Policy to:
   ```json
    [
        {
            "AllowedOrigins": [
            "http://localhost:5173",
            "http://localhost:3000"
            ],
            "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "HEAD"
            ],
            "AllowedHeaders": [
            "*"
            ],
            "ExposeHeaders": [
            "ETag"
            ],
            "MaxAgeSeconds": 3600
        }
    ]
    ```

## Endpoints

### Frontend:

- `http://localhost:5173`

### Backend:

- Express Server: `http://localhost:5000/api` (Port `5000` by default edit at `/backend/.env`)

#### Docker:

- PostgreSQL: `http://localhost:5433` (In docker container port is `5432`)
- MongoDB: `http://localhost:27017`
