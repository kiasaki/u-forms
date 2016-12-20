# μForms

_HTML form or Feedback widget => Database record and Email notification_

## Intro

## Features

## Running

## Developing

_(here `$ ` is representing your shell prompt, type in the command after the `$`)_

You can start by creating a PosgreSQL database named "uforms" owned by a user named "uforms" having
the passowrd "uforms".

```
$ psql
user=# CREATE ROLE "uforms" WITH SUPERUSER LOGIN PASSWORD 'uforms';
[...]
user=# CREATE DATABASE "uforms" WITH OWNER "uforms";
[...]
user=# \q
```

Next up, let's run the migrations against that database:

```
$ make migrate_up
./node_modules/.bin/knex migrate:latest
Batch 1 run: 1 migrations
/Users/kiasaki/code/repos/u-forms/data/migrations/20161219184527_users.js
[...]
```

Ready, set, go! Let's fire up that dev server and start developing:

```
$ make
node --harmony index.js
{level: 'debug', message: 'container:set', id: 1, key: 'config'}
{level: 'info', message: 'config: loading from env'}
{level: 'debug', message: 'container:set', id: 1, key: 'jwt'}
{level: 'info', message: 'app started on port 3000'}
```

## License

MIT. See `license` file.
