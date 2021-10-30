const green = require('chalk').bgGreen.black
const red = require('chalk').bgRed
const { Pool, Client } = require('pg')

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

	const dbHeroku = new Client({
		connectionString: process.env.DATABASE_URL+'?ssl=true',
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
