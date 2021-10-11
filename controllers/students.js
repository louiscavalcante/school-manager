const fs = require('fs')
const data = require('../data.json')
const { grade, date } = require('../utils.js')

exports.index = function (req, res) {
	const { students } = data
	const newStudents = students.map(splitFunc)

	function splitFunc(student) {
		let studentsFormatted = {
			...student,
			school_year: grade(student.school_year),
		}
		return studentsFormatted
	}

	return res.render('students/index', { students: newStudents })
}

exports.create = function (req, res) {
	return res.render('students/create')
}

exports.post = function (req, res) {
	const keys = Object.keys(req.body)

	for (let key of keys) {
		if (req.body[key] == '' || req.body[key] == 'empty') {
			return res.send('Please fill all the fields!')
		}
	}

	let { avatar_url, full_name, birth, email, school_year, workload } = req.body

	birth = Date.parse(birth)
	const created_at = Date.now()

	let id = 1
	const lastStudent = data.students[data.students.length - 1]
	if (lastStudent) {
		id = lastStudent.id + 1
	}

	data.students.push({
		id,
		avatar_url,
		full_name,
		birth,
		email,
		school_year,
		workload,
		created_at,
	})

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
		if (err) return res.send('Write file error!')

		return res.redirect('/students')
	})
}

exports.show = function (req, res) {
	const { id } = req.params

	const foundStudent = data.students.find(function (student) {
		return student.id == id
	})

	if (!foundStudent) return res.send('Student not found!')

	const student = {
		...foundStudent,
		birth: date(foundStudent.birth).birthDay,
		school_year: grade(foundStudent.school_year),
		created_at: new Intl.DateTimeFormat('pt-BR').format(foundStudent.created_at),
	}

	return res.render('students/show', { student: student })
}

exports.edit = function (req, res) {
	const { id } = req.params

	const foundStudent = data.students.find(function (student) {
		return student.id == id
	})

	if (!foundStudent) return res.send('Student not found!')

	const student = {
		...foundStudent,
		birth: date(foundStudent.birth).iso,
	}

	return res.render('students/edit', { student: student })
}

exports.put = function (req, res) {
	const { id } = req.body
	let index = 0

	const foundStudent = data.students.find(function (student, foundIndex) {
		if (id == student.id) {
			index = foundIndex
			return true
		}
	})

	if (!foundStudent) return res.send('Student not found!')

	const student = {
		...foundStudent,
		...req.body,
		birth: Date.parse(req.body.birth),
		id: Number(req.body.id),
	}

	data.students[index] = student

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
		if (err) return res.send('Write file error!')

		return res.redirect(`/students/${id}`)
	})
}

exports.delete = function (req, res) {
	const { id } = req.body

	const filteredStudents = data.students.filter(function (student) {
		return student.id != id
	})

	data.students = filteredStudents

	fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
		if (err) return res.send('Write file error!')
	})

	return res.redirect('/students')
}
