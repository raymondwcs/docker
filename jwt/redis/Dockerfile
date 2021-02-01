FROM redis
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY import.sh /usr/src/app/
RUN chmod 555 ./import.sh
CMD ./import.sh