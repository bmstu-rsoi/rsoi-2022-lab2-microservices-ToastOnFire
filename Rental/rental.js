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

rental.get(path+'/rental', (request, response) => {
	let getAllUserRentsQuery = `
	SELECT * FROM rental WHERE username = $1;
	`
	
	pool.query(getAllUserRentsQuery, request.query.username)
		.then(res => {
			let resObject = {
				page: +request.query.page,
				pageSize: +request.query.size,
				totalElements: 0,
				items: []
			}
			
			
			for(let i = 0; i < resObject.items.length; i++){
				resObject.items[i].carUid = resObject.items[i]['car_uid'];
				delete resObject.items[i].car_uid;
				resObject.items[i].registrationNumber = resObject.items[i]['registration_number'];
				delete resObject.items[i].registration_number;
			}
				
			response.status(200).json(resObject);
		})
});

rental.get(path+'/rental_by_id', (request, response) => {
	let getAllCarsQuery = `
	SELECT * FROM cars
	`
	
	getAllCarsQuery += (request.query.showAll == false ? ' WHERE available = true;' : ';');
	
	pool.query(getAllCarsQuery)
		.then(res => {
			let resObject = {
				page: +request.query.page,
				pageSize: +request.query.size,
				totalElements: 0,
				items: []
			}
			
			resObject.items = res.rows.slice((resObject.page-1) * resObject.pageSize, resObject.page * resObject.pageSize);
			resObject.totalElements = resObject.items.length;
			
		for(let i = 0; i < resObject.items.length; i++){
			resObject.items[i].carUid = resObject.items[i]['car_uid'];
			delete resObject.items[i].car_uid;
			resObject.items[i].registrationNumber = resObject.items[i]['registration_number'];
			delete resObject.items[i].registration_number;
		}
			
			response.status(200).json(resObject);
		})
});

rental.post(path+'/rental', (request, response) => {
	let getAllCarsQuery = `
	SELECT * FROM cars
	`
	
	getAllCarsQuery += (request.query.showAll == false ? ' WHERE available = true;' : ';');
	
	pool.query(getAllCarsQuery)
		.then(res => {
			let resObject = {
				page: +request.query.page,
				pageSize: +request.query.size,
				totalElements: 0,
				items: []
			}
			
			resObject.items = res.rows.slice((resObject.page-1) * resObject.pageSize, resObject.page * resObject.pageSize);
			resObject.totalElements = resObject.items.length;
			
		for(let i = 0; i < resObject.items.length; i++){
			resObject.items[i].carUid = resObject.items[i]['car_uid'];
			delete resObject.items[i].car_uid;
			resObject.items[i].registrationNumber = resObject.items[i]['registration_number'];
			delete resObject.items[i].registration_number;
		}
			
			response.status(200).json(resObject);
		})
});

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