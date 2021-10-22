const { age, graduation, date } = require('../lib/utils.js')
const Teacher = require('../models/teacher.js')

module.exports = {
	index(req, res) {
		const { filter } = req.query

		function splitFunc(teacher) {
			let teachersFormatted = {
				...teacher,
				teaches: teacher.teaches.split(','),
			}
			return teachersFormatted
		}

		if (filter) {
			Teacher.findBy(filter, function (teachers) {
				const newTeachers = teachers.map(splitFunc)

				return res.render('teachers/index', { teachers: newTeachers, filter })
			})
		} else {
			Teacher.all(function (teachers) {
				const newTeachers = teachers.map(splitFunc)

				return res.render('teachers/index', { teachers: newTeachers })
			})
		}
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

		Teacher.create(req.body, function (teacher) {
			return res.redirect(`/teachers/${teacher.id}`)
		})
	},
	show(req, res) {
		Teacher.find(req.params.id, function (foundTeacher) {
			if (!foundTeacher) return res.send('Teacher not found!')

			foundTeacher.age = age(foundTeacher.birth)
			foundTeacher.degree_level = graduation(foundTeacher.degree_level)
			foundTeacher.teaches = foundTeacher.teaches.split(',')
			foundTeacher.created_at = new Intl.DateTimeFormat('pt-BR').format(
				foundTeacher.created_at
			)

			return res.render('teachers/show', { teacher: foundTeacher })
		})
	},
	edit(req, res) {
		Teacher.find(req.params.id, function (foundTeacher) {
			if (!foundTeacher) return res.send('Teacher not found!')

			foundTeacher.birth = date(foundTeacher.birth).iso

			return res.render('teachers/edit', { teacher: foundTeacher })
		})
	},
	put(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

		Teacher.update(req.body, function () {
			return res.redirect(`/teachers/${req.body.id}`)
		})
	},
	delete(req, res) {
		Teacher.delete(req.body.id, function () {
			return res.redirect('/teachers')
		})
	},
}
