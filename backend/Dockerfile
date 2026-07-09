FROM node:26-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm i
COPY . .

# Generate Prisma Files
RUN npx prisma generate

# Load Schema to DB
RUN npx prisma migrate dev --name init


CMD ["npm", "run", "dev"]
