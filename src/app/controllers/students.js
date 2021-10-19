const { grade, date } = require('../lib/utils.js')

module.exports = {
	index(req, res) {
		return res.render('students/index')
	},
	create(req, res) {
		return res.render('students/create')
	},
	post(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

		let { avatar_url, full_name, birth, email, school_year, workload } = req.body

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
