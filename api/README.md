# PureCare API application

This is PureCare API server built in AdonisJs.

## System Requirements
Ensure your versions of those tools match the following criteria:
<pre>
Node.js >= 12.18.1
npm >= 6.14.4 
pm2 >= 4.4.0
adonis = 4.0.12
</pre>

## Setup

Clone the repo and then run `npm install`.

## Configure .env

Rename `env.example` to `.env`. Update environment variable with appropriate values.
Quite often, you will have strings where you want the $ dollar character to be considered as a literal value. In that case you can escape the character as follows.
<pre>
Actual string: pa$$word

Use this in .env file
PASSWORD=pa\$\$word
</pre>

## Database Migration

Run the following command to run startup migrations.

```js
adonis migration:run
```

## Database Seeding

Run the following command to seed your seeds into the database.

```js
adonis seed --files="databaseSeeder.js"
```
## Move Database from one server to another

You can use any visual tool for mysql(e.g. MySQL WorkBench, phpMyAdmin) to import DB from old server and export DB to new server.

## Update logo path for email templates

Please update logo path according to your server host(Server on which Angular front hosted).
Currently we have used `http://159.89.176.66:4200`. Please replace it in all template files located at `resources/views/email` with your server host(e.g. `http://1xx.xx.xx.xx`)
## Update DB/Server Timezone
Using the Command Line (terminal) 
### Update Server Timezone
<pre>
<code>
timedatectl set-timezone Asia/Hong_Kong
</code>
</pre>


### Update MySQL Timezone
Open File
<pre>
<code>
sudo nano /etc/mysql/my.cnf
</code>
</pre>
Add this at EOF
<pre>
<code>
[mysqld]
default-time-zone = "+08:00"
</code>
</pre>
Restart mysql 
<pre>
<code>
service mysql restart
</code>
</pre>

## Running in development mode

- Run `npm run start` to start pm2, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:3001`

## Running in production mode

- Run `npm run start:prod` to start pm2, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:3000`
