# Официальный образ nodejs 8.5
FROM node:carbon

# Задаем путь, чтобы запускать команды
# ENV PATH="$PATH:/usr/src/node_modules/.bin"

# Создаём слой для кжширования npm install
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production

# Копируем файлы внутрь контейнера
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
# Копируем файлы
ADD . /usr/src/app
COPY . /usr/src/app
# RUN ["npm","run","migrate"]
# EXPOSE 3000 3030
EXPOSE 5432 5432
