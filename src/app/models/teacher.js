const db = require('../config/db.js')
const teachers = require('../controllers/teachers.js')
const { date } = require('../lib/utils.js')

module.exports = {
	all(callback) {
		db.query(
			`
            SELECT teachers.*, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            GROUP BY teachers.id
            ORDER BY total_students DESC`,
			function (err, results) {
				if (err) throw `Database error! ${err}`

				callback(results.rows)
			}
		)
	},

	create(data, callback) {
		const query = `
            INSERT INTO teachers (
                avatar_url,
                full_name,
                birth,
                degree_level,
                attendance_type,
                teaches,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

		const values = [
			data.avatar_url,
			data.full_name,
			date(data.birth).iso,
			data.degree_level,
			data.attendance_type,
			data.teaches,
			date(Date.now()).iso,
		]

		db.query(query, values, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows[0])
		})
	},

	find(id, callback) {
		db.query(
			`
            SELECT *
            FROM teachers
            WHERE id = $1`,
			[id],
			function (err, results) {
				if (err) throw `Database error! ${err}`

				callback(results.rows[0])
			}
		)
	},

	findBy(filter, callback) {
		db.query(
			`
            SELECT teachers.*, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            WHERE teachers.full_name ILIKE '%${filter}%'
            OR teachers.teaches ILIKE '%${filter}%'
            GROUP BY teachers.id
            ORDER BY total_students DESC`,
			function (err, results) {
				if (err) throw `Database error! ${err}`

				callback(results.rows)
			}
		)
	},

	update(data, callback) {
		const query = `
            UPDATE teachers SET
                avatar_url=($1),
                full_name=($2),
                birth=($3),
                degree_level=($4),
                attendance_type=($5),
                teaches=($6)
            WHERE id = $7
        `

		const values = [
			data.avatar_url,
			data.full_name,
			date(data.birth).iso,
			data.degree_level,
			data.attendance_type,
			data.teaches,
			data.id,
		]

		db.query(query, values, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback()
		})
	},

	delete(id, callback) {
		db.query(`DELETE FROM teachers WHERE id = $1`, [id], function (err, results) {
			if (err) throw `Database error! ${err}`

			callback()
		})
	},

	paginate(params) {
		const { filter, limit, offset, callback } = params

		let query = '',
			filterQuery = '',
			totalQuery = `(
                SELECT count(*) FROM teachers
                ) AS total`

		if (filter) {
			filterQuery = `
                WHERE teachers.full_name ILIKE '%${filter}%'
                OR teachers.teaches ILIKE '%${filter}%'
            `

			totalQuery = `(
                SELECT count(*) FROM teachers
                ${filterQuery}
                ) AS total`
		}

		query = `
            SELECT teachers.*, ${totalQuery}, count(students) as total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            ${filterQuery}
            GROUP BY teachers.id LIMIT $1 OFFSET $2
        `

		db.query(query, [limit, offset], function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows)
		})
	},
}
