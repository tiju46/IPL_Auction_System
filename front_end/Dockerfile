FROM nginx:alpine

# Copy website files
COPY . /usr/share/nginx/html

# Replace default Nginx config to use Cloud Run PORT
RUN sed -i 's/listen       80;/listen       ${PORT};/' /etc/nginx/conf.d/default.conf

# Expose Cloud Run port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
