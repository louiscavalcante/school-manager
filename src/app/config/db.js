const green = require('chalk').bgGreen.black
const red = require('chalk').bgRed
const { Pool } = require('pg')

if (process.env.APP_ENV === 'development') {
	console.log(green('----- Development -----'))

	const dbLocal = new Pool({
		user: 'postgres',
		password: 'postgres',
		host: 'localhost',
		port: 5432,
		database: 'schoolmanager',
	})

	console.log('Connected to Local Database!')
	module.exports = dbLocal
} else {
	console.log(red('----- Production -----'))

	const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

	const dbHeroku = new Client({
		connectionString: connectionString,
		ssl: {
			rejectUnauthorized: false,
		},
		idle_in_transaction_session_timeout: 600000,
	})

	dbHeroku
		.connect()
		.then(() => console.log('Connected to Heroku Database!'))
		.catch(err => console.error(red('Heroku Database Connection Error:', err)))

	module.exports = dbHeroku
}
