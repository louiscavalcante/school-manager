const db = require('../config/db.js')
const { date } = require('../lib/utils.js')

module.exports = {
	all(callback) {
		db.query(
			`
            SELECT *
            FROM students
            ORDER BY full_name ASC`,
			function (err, results) {
				if (err) throw `Database error! ${err}`

				callback(results.rows)
			}
		)
	},

	create(data, callback) {
		const query = `
            INSERT INTO students (
                avatar_url,
                full_name,
                birth,
                email,
                school_year,
                workload,
                created_at,
                teacher_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `

		const values = [
			data.avatar_url,
			data.full_name,
			date(data.birth).iso,
			data.email,
			data.school_year,
			data.workload,
			date(Date.now()).iso,
			data.teacher,
		]

		db.query(query, values, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows[0])
		})
	},

	find(id, callback) {
		db.query(
			`
            SELECT students.*, teachers.full_name AS teacher_name
            FROM students
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1`,
			[id],
			function (err, results) {
				if (err) throw `Database error! ${err}`

				callback(results.rows[0])
			}
		)
	},

	update(data, callback) {
		const query = `
            UPDATE students SET
                avatar_url=($1),
                full_name=($2),
                birth=($3),
                email=($4),
                school_year=($5),
                workload=($6),
                teacher_id=($7)
            WHERE id = $8
        `

		const values = [
			data.avatar_url,
			data.full_name,
			date(data.birth).iso,
			data.email,
			data.school_year,
			data.workload,
			data.teacher,
			data.id,
		]

		db.query(query, values, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback()
		})
	},

	delete(id, callback) {
		db.query(`DELETE FROM students WHERE id = $1`, [id], function (err, results) {
			if (err) throw `Database error! ${err}`

			callback()
		})
	},

	teachersSelectOptions(callback) {
		db.query(`SELECT full_name, id FROM teachers`, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows)
		})
	},

	paginate(params) {
		const { filter, limit, offset, callback } = params

		let query = '',
			filterQuery = '',
			totalQuery = `(
                SELECT count(*) FROM students
                ) AS total`

		if (filter) {
			filterQuery = `
                WHERE students.full_name ILIKE '%${filter}%'
                OR students.email ILIKE '%${filter}%'
            `

			totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
                ) AS total`
		}

		query = `
            SELECT students.*, ${totalQuery} 
            FROM students
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `

		db.query(query, [limit, offset], function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows)
		})
	},
}
