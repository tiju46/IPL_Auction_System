FROM nginx:alpine

# Copy website files to Nginx default directory
COPY . /usr/share/nginx/html

# Cloud Run sets PORT env variable, so update Nginx to use it
RUN sed -i 's/listen       80;/listen       ${PORT};/' /etc/nginx/conf.d/default.conf

# Expose the port Cloud Run expects
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
