const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const Person = require('./models/person');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};

app.use(requestLogger);

app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons.map(person => person.toJSON()));
	});
});

app.get('/info', (req, res) => {
	const date = new Date();
	const oldPersons = [];

	Person.find({})
		.then(persons => {
			persons.map(person => oldPersons.push(person));
		}).then(() => {
			res.send(`
			<h5>Phonebook has info for ${oldPersons.length} people</h5>
			<p>${date}</p>
		`);
		});
});

app.post('/api/persons', (req, res) => {
	const body = req.body;
	const person = new Person({
		name: body.name,
		number: body.number
	});

	person.save().then(savedPerson => {
		res.json(savedPerson.toJSON());
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(note => {
			if (note) {
				response.json(note.toJSON());
			} else {
				response.status(204).end();
			}
		})
		.catch(error => next(error));
});
app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;
	const person = {
		name: body.name,
		number: body.number
	};
	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson.toJSON());
		})
		.catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end();
		})
		.catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
