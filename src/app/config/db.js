const { Pool } = require('pg')

modules.exports = new Pool({
	user: 'postgres',
	password: 'postgres',
	host: process.env.DATABASE_URL || 'localhost',
	port: process.env.PORT || 5432,
	database: 'schoolmanager',
})
