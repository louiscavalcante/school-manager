const { grade, date } = require('../lib/utils.js')
const Student = require('../models/student.js')

module.exports = {
	index(req, res) {
		Student.all(function (students) {
			const newStudents = students.map(splitFunc)

			function splitFunc(student) {
				let studentsFormatted = {
					...student,
					school_year: grade(student.school_year),
				}
				return studentsFormatted
			}

			return res.render('students/index', { students: newStudents })
		})
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

			return res.render('students/edit', { student: foundStudent })
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
