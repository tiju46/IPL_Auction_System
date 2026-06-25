FROM nginx:alpine

ENV PORT=8080

COPY . /usr/share/nginx/html

RUN sed -i "s/listen       80;/listen       ${PORT};/" /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["sh", "-c", "nginx -g 'daemon off;'"]
