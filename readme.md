# μForms

_HTML form or Feedback widget => Database record and Email notification_

## Intro

**μForms** is a simple application you can self host that acts as a form backend or endpoint.

It enables you to have forms in completely static websites and still collect the information
entered.

Common use cases include a contact form collecting name, email and a message that **μForms**
will save (and, optionally, notify you via email). An other use case could be a simple feedback
widget located at the bottom of all you website's pages for users to report bugs or suggest
features.

## Features

- Save any form fields
- Self-host
- Email notifications
- Simple to use and operate

## Running

**μForms** is a Node.js application, to run it you can simply invoke `index.js` like so:

```
node --harmony index.js
```

Now for the application to run correctly you need to have a few extra things setup (like
node.js dependencies and a postgresql database), read the section bellow ("Developing") to know
how to set those up.

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

Now let's fetch the dependencies before we run any code that requires them:

```
$ yarn
yarn install v0.18.1
[1/9] 🔍  Resolving packages...
[...]
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
