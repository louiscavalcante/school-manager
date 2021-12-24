const { grade, date } = require('../lib/utils.js')
const Student = require('../models/student.js')

module.exports = {
	index(req, res) {
		let { filter, page, limit } = req.query

		page = page || 1
		limit = limit || 2
		let offset = limit * (page - 1)

		function splitFunc(student) {
			let studentsFormatted = {
				...student,
				school_year: grade(student.school_year),
			}
			return studentsFormatted
		}

		const params = {
			filter,
			page,
			limit,
			offset,
			callback(students) {
				const newStudents = students.map(splitFunc)

				if (students[0] === undefined) {
					const total = 1
					return res.render('students/index', {
						student: newStudents,
						filter,
						page,
						total,
					})
				}

				const pagination = {
					total: Math.ceil(students[0]?.total / limit),
					page,
				}
				return res.render('students/index', { students: newStudents, filter, pagination })
			},
		}
		Student.paginate(params)
	},
	create(req, res) {
		Student.teachersSelectOptions(function (options) {
			return res.render('students/create', { teacherOptions: options })
		})
	},
	post(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

		Student.create(req.body, function (student) {
			return res.redirect(`/students/${student.id}`)
		})
	},
	show(req, res) {
		Student.find(req.params.id, function (foundStudent) {
			if (!foundStudent) return res.send('Student not found!')

			foundStudent.birth = date(foundStudent.birth).birthDay
			foundStudent.school_year = grade(foundStudent.school_year)
			foundStudent.created_at = new Intl.DateTimeFormat('pt-BR').format(
				foundStudent.created_at
			)

			return res.render('students/show', { student: foundStudent })
		})
	},
	edit(req, res) {
		Student.find(req.params.id, function (foundStudent) {
			if (!foundStudent) return res.send('Student not found!')

			foundStudent.birth = date(foundStudent.birth).iso

			Student.teachersSelectOptions(function (options) {
				return res.render('students/edit', {
					student: foundStudent,
					teacherOptions: options,
				})
			})
		})
	},
	put(req, res) {
		const keys = Object.keys(req.body)

		for (let key of keys) {
			if (req.body[key] == '' || req.body[key] == 'empty') {
				return res.send('Please fill all the fields!')
			}
		}

		Student.update(req.body, function () {
			return res.redirect(`/students/${req.body.id}`)
		})
	},
	delete(req, res) {
		Student.delete(req.body.id, function () {
			return res.redirect('/students')
		})
	},
}
