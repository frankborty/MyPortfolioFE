# Stage 1: Build dell'app Angular
FROM node:20-alpine AS build
#Set the working directory
WORKDIR /app
#Copy the package.json and package-lock.json files
COPY package*.json ./
#Run a clean install of th dependency
RUN npm ci
#Install Angular CLI globally
RUN npm install -g @angular/cli
#Copy all files
COPY . .
#Build the application
RUN npm run build


#Step 2: Step nginx image to serve the application
FROM nginx:latest
#Copy the build output to replace the default nginx contents
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#COPY the build output to replace the default nginx contents
COPY --from=build /app/dist/my-bad-portfolio-site/browser /usr/share/nginx/html

#Expose port 80
EXPOSE 80

