FROM node:16-alpine
ENV NODE_OPTIONS=--max_old_space_size=2048
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only-production
COPY . .
RUN npm run build
EXPOSE 4001
CMD ["npm", "run", "dev"]