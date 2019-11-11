import React, { useState, useEffect } from 'react';
import personService from './services/persons';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterText, setFilterText] = useState('');

	useEffect(() => {
		personService.getAll().then((initialNotes) => setPersons(initialNotes));
	}, []);

	const removeThis = (id) => {
		personService.deletePerson(id).then(() => {
			const updatedPersons = persons.filter((person) => person.id !== id);
			setPersons(updatedPersons);
		});
	};

	const Person = (item) => (
		<li>
			{item.name} {item.nro} <button onClick={() => removeThis(item.id)}>Remove</button>
		</li>
	);
	const addName = (event) => {
		event.preventDefault();
		let r;

		const checkIfNameExists = () => {
			const match = persons.filter((person) => newName === person.name);
			if (match.length) {
				r = confirm(`Nimi ${newName} on jo olemassa. Haluatko, että korvaamme olemassaolevan puhelinnumeron?`);
			}
			return r;
		};
		checkIfNameExists();
		if (r === true) {
			const item = persons.filter((person) => newName === person.name);
			const newObj = {
				name: item[0].name,
				number: newNumber,
				id: item[0].id
			};
			const itemId = newObj.id;
			personService.put(newObj, itemId).then((data) => {
				const posts = [...persons];
				const index = posts.findIndex((post) => post.id === itemId);
				posts[index] = data;
				setPersons(posts);
			});
			return;
		} else if (r === false) {
			return;
		} else {
			const nameObj = {
				name: newName,
				number: newNumber,
				id: persons.length + 1
			};

			personService.create(nameObj).then((data) => {
				setPersons(persons.concat(data));
				setNewName('');
				setNewNumber('');
			});
		}
	};

	const handleNameChange = () => {
		setNewName(event.target.value);
	};

	const handleNumberChange = () => {
		setNewNumber(event.target.value);
	};

	const rows = () => {
		const filteredPersons = persons.filter((person) =>
			person.name.toLowerCase().includes(filterText.toLowerCase())
		);

		if (filteredPersons.length === 0) {
			return <p>Ei tuloksia</p>;
		} else {
			return filteredPersons.map((person, i) => (
				<Person key={person.id} name={person.name} nro={person.number} id={person.id} />
			));
		}
	};

	const onFilterInputChange = (event) => {
		setFilterText(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>
			Filter Persons
			<input value={filterText} onChange={onFilterInputChange} />
			<form onSubmit={addName}>
				<h2>Add New</h2>
				<div>
					name: <input value={newName} onChange={handleNameChange} />
					number: <input value={newNumber} onChange={handleNumberChange} />
				</div>
				<div>
					<button type='submit'>add</button>
				</div>
			</form>
			<h2>Numbers</h2>
			<ul>{rows()}</ul>
		</div>
	);
};

export default App;
