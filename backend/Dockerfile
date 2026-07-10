FROM node:26-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm i
COPY . .

# Generate Prisma Files
RUN npx prisma generate

# Load Schema to DB
RUN npx prisma migrate dev --name init

# Load Seed to DB
RUN npx prisma db seed 

CMD ["npm", "run", "dev"]
