const express = require('express');
const { Pool } = require('pg');
const payment = express();
const bodyParser = require('body-parser');

const path = '/api/v1';
const serverPortNumber = 8050;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

const pool = new Pool({
	user: 'program',
	database: 'payments',
	password: 'test',
	port: 5432,
	host: 'postgres',
});

payment.use(bodyParser.json());
payment.use(bodyParser.urlencoded({
  extended: true
})); 

setTimeout(() => {
	tableInit();
}, 2000);

payment.get('/manage/health', (request, response) => {
  response.status(200).send();
});

payment.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Payment server works on port '+serverPortNumber);
})

function tableInit() {
	let carsTable = `
	CREATE TABLE payment
	(
		id          SERIAL PRIMARY KEY,
		payment_uid uuid        NOT NULL,
		status      VARCHAR(20) NOT NULL
			CHECK (status IN ('PAID', 'CANCELED')),
		price       INT         NOT NULL
	);
	`;

	pool.query(carsTable)
		.then(res => {
			console.log('Table initialized')
		})
		.catch(err => {
			console.log('Table initialization error');
		})
}