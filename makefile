run:
	node index.js

deps:
	yarn

lint:
	./node_modules/.bin/eslint .

migrate_up:
	./node_modules/.bin/knex migrate:latest

migrate_down:
	./node_modules/.bin/knex migrate:rollback

migrate_create:
	./node_modules/.bin/knex migrate:make $(NAME)
