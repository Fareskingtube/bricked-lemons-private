FROM node:26-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm i
COPY . .

# # Add DATABASE_URL for prisma to be happy :D <- Prisma Now (Hopefully)
# ARG DATABASE_URL="postgresql://dev:dev@localhost:5432/bricked_lemons_db"
# ENV DATABASE_URL=$DATABASE_URL

# # Generate Prisma Files
# RUN npx prisma generate

# # Load Schema to DB
# RUN npx prisma migrate dev --name init

# # Load Seed to DB
# RUN npx prisma db seed 

# CMD ["npm", "run", "dev"]

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]