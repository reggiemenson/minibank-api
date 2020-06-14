
install:
	npm install

up:
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
	npm run serve

