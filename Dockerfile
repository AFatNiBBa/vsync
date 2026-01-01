
FROM node:25
WORKDIR /app
#COPY ./package/vsync/.output .
COPY . .
RUN npm i
RUN npm run build
ENV PORT=80
#CMD [ "node", "/app/server/index.mjs" ]
CMD [ "node", "./package/vsync/.output/server/index.mjs" ] 
