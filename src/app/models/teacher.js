const db = require('../config/db.js')
const { date } = require('../lib/utils.js')

module.exports = {
	all(callback) {
        db.query(`
            SELECT *
            FROM teachers
            ORDER BY full_name ASC`, function (err, results) {
			if (err) throw `Database error! ${err}`

			callback(results.rows)
		})
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
}
