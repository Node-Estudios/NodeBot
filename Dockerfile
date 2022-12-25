FROM node:18-alpine

WORKDIR /app
COPY package*.json .
RUN npm install
# ci --only=production
RUN npm install -g typescript
RUN apk add ffmpeg
COPY . .
EXPOSE 80
# RUN npm install
CMD ["tsc"]

