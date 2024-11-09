# Build stage
FROM node:lts-alpine3.20 AS build

WORKDIR /

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:lts-alpine3.20 AS production

WORKDIR /

COPY package*.json . 

RUN npm ci --only=production

# Copy the generated Prisma Client and schema from the build stage
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]