// const mongoose = require('mongoose');

// const password = process.argv[2];
// const name = process.argv[3];
// const number = process.argv[4];

// const url = `mongodb+srv://fullstack:${password}@cluster0-4zsio.mongodb.net/persons-app?retryWrites=true&w=majority`;

// mongoose.connect(url, { useNewUrlParser: true });

// const personSchema = new mongoose.Schema({
// 	name: String,
// 	number: String
// });

// const Person = mongoose.model('Person', personSchema);

// if (process.argv.length < 3) {
// 	console.log('give password as argument');
// 	process.exit(1);
// } else if (process.argv.length === 3) {
// 	Person.find({}).then(result => {
// 		result.forEach(person => {
// 			console.log(person.name + ' ' + person.number);
// 		});
// 		mongoose.connection.close();
// 	});
// } else {
// 	const person = new Person({
// 		name,
// 		number
// 	});

// 	person.save().then(response => {
// 		console.log('person saved!');
// 		mongoose.connection.close();
// 	});
// }
