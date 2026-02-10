# Use a Node.js image to build the frontend
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run build

# Use a Node.js image to serve the build files
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/dist /app/dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5171"]
EXPOSE 5171
