module.exports = {
	age(timestamp) {
		const today = new Date()
		const birthDate = new Date(timestamp)

		let age = today.getFullYear() - birthDate.getFullYear()
		const month = today.getMonth() - birthDate.getMonth()

		if (month < 0 || (month == 0 && today.getDate() < birthDate.getDate())) {
			age = age - 1
		}

		return age
	},
	date(timestamp) {
		const date = new Date(timestamp)

		const year = date.getUTCFullYear()
		// Months goes from 0 to 11, so you need to add 1
		const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
		const day = `0${date.getUTCDate()}`.slice(-2)

		// iso: Needs to return YYYY-MM-DD
		return {
			day,
			month,
			year,
			iso: `${year}-${month}-${day}`,
			birthDay: `${day}/${month}`,
			format: `${day}/${month}/${year}`,
		}
	},
	graduation(degree) {
		switch (degree) {
			case 'associate':
				return 'Associate degree'
			case 'bachelor':
				return "Bachelor's degree"
			case 'master':
				return "Master's degree"
			case 'doctor':
				return 'Doctoral degree'
		}
	},
	grade(year) {
		switch (year) {
			case 8:
				return '8th Grade'
			case 9:
				return '9th Grade'
			case 10:
				return '10th Grade'
			case 11:
				return '11th Grade'
			case 12:
				return '12th Grade'
		}
	},
}
