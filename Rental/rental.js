const express = require('express');
const { Pool } = require('pg');
const rental = express();
const bodyParser = require('body-parser');

const path = '/api/v1';
const serverPortNumber = 8060;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

const pool = new Pool({
	user: 'program',
	database: 'rentals',
	password: 'test',
	port: 5432,
	host: 'postgres',
});

rental.use(bodyParser.json());
rental.use(bodyParser.urlencoded({
  extended: true
})); 

setTimeout(() => {
	tableInit();
}, 2000);

rental.get('/manage/health', (request, response) => {
  response.status(200).send();
});

rental.post(path+'/rental/add', (request, response) => {
	let addRentalQuery = `
	INSERT INTO rental (rental_uid, username, payment_uid, car_uid, date_from, date_to, status) 
	VALUES ($1, $2, $3, $4, $5, $6, 'IN_PROGRESS');
	`
	
	pool.query(addRentalQuery, Object.values(request.body))
		.then(res => {
			response.sendStatus(200);
		}).catch(err => {
			response.sendStatus(400);
		})
});

rental.get(path+'/rental_by_user', (request, response) => {
	let getAllUserRentsQuery = `
	SELECT rental_uid, status, to_char(date_from, 'YYYY-MM-DD') date_from, to_char(date_to, 'YYYY-MM-DD') date_to, car_uid, payment_uid, username FROM rental
	WHERE username = $1;
	`
	
	pool.query(getAllUserRentsQuery, [request.query.username])
		.then(res => {
			response.status(200).json(res.rows);
		})
})

rental.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Rental server works on port '+serverPortNumber);
})

function tableInit() {
	let rentalsTable = `
	CREATE TABLE rental
	(
		id          SERIAL PRIMARY KEY,
		rental_uid  uuid UNIQUE              NOT NULL,
		username    VARCHAR(80)              NOT NULL,
		payment_uid uuid                     NOT NULL,
		car_uid     uuid                     NOT NULL,
		date_from   TIMESTAMP WITH TIME ZONE NOT NULL,
		date_to     TIMESTAMP WITH TIME ZONE NOT NULL,
		status      VARCHAR(20)              NOT NULL
			CHECK (status IN ('IN_PROGRESS', 'FINISHED', 'CANCELED'))
	);
	`;

	pool.query(rentalsTable)
		.then(res => {
			console.log('Table initialized')
		})
		.catch(err => {
			console.log('Table initialization error');
		})
}