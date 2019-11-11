const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let persons = [
	{
		name: 'asd',
		number: '',
		id: 1
	},
	{
		name: 'Teppo Testaaja',
		number: '40040 123123 123',
		id: 2
	},
	{
		name: 'ASD',
		number: '20304320 32423',
		id: 3
	}
];

app.get('/api/persons', (req, res) => {
	res.json(persons);
});
app.get('/info', (req, res) => {
	const date = new Date();
	res.send(`
		<h5>Phonebook has info for ${persons.length} people</h5>
		<p>${date}</p>
	`);
});

const generateId = () => {
	const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
	return maxId + 1;
};

morgan.token('body', (req, res) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body);
	}
});
app.use(morgan(':method :url :status :body'));

app.post('/api/persons', (req, res) => {
	const body = req.body;
	const nameAlreadyExists = persons.find((person) => person.name === body.name);
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		});
	}
	if (nameAlreadyExists) {
		return res.status(400).json({
			error: 'name already exists'
		});
	}
	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	};

	persons = persons.concat(person);

	res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((person) => person.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((person) => person.id !== id);
	res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
