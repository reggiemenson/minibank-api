
install:
	npm install

services:
	docker-compose up -d

down:
	docker-compose down

check:
	docker ps

test: 
	npm run test

start:
	node app.js

run:
	nodemon app.js

