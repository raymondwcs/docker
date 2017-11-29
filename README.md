# COMPS381F - Container Virtualization Using Docker [Reference]

1. Run `server.js`. Make a note about which version of Node.js is being used.
3. Register at [Docker Hub](https://hub.docker.com) to obtain your own Docker User ID (`your-docker-id`).
3. Build a *docker image*
   ```
   docker build -t "your-docker-id/oldnodejs"
   ```
4. Verify that docker image has been successfully created.
   ```
   docker images
   ```
5. Run your container
   ```
   docker run -d -p 8099:8099 your-docker-id/oldnodejs
   ```
6. Verify that your container is running
   ```
   docker ps
   ```
7. Run the `server.js` in your container.  Go to `localhost:8099`
8. Which version of Node.js is being used?
9. Share your container image by uploading it to Docker Hub
   ```
   docker login
   docker push your-docker-id/oldnodejs
   ```