const { age, graduation, date } = require('../lib/utils.js')

module.exports = {
	index(req, res) {
		return res.render('teachers/index')
	},
	create(req, res) {
		return res.render('teachers/create')
	},
	post(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

		let { avatar_url, full_name, birth, degree_level, attendance_type, teaches } = req.body

        return
	},
	show(req, res) {
        return
	},
	edit(req, res) {
        return
	},
	put(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

        return
	},
	delete(req, res) {
        return
	},
}
