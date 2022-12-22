const express = require('express');
const { Pool } = require('pg');
const gateway = express();
const bodyParser = require('body-parser');

const path = '/api/v1';
const serverPortNumber = 8070;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

const pool = new Pool({
	user: 'program',
	database: 'cars',
	password: 'test',
	port: 5432,
	host: 'postgres',
});

gateway.use(bodyParser.json());
gateway.use(bodyParser.urlencoded({
  extended: true
})); 

tableInit();

gateway.get(path+'/manage/health', (request, response) => {
  response.status(200).send();
});

gateway.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Cars server works on port '+serverPortNumber);
})

function tableInit() {
	let carsTable = `
	CREATE TABLE cars
	(
		id                  SERIAL PRIMARY KEY,
		car_uid             uuid UNIQUE NOT NULL,
		brand               VARCHAR(80) NOT NULL,
		model               VARCHAR(80) NOT NULL,
		registration_number VARCHAR(20) NOT NULL,
		power               INT,
		price               INT         NOT NULL,
		type                VARCHAR(20)
			CHECK (type IN ('SEDAN', 'SUV', 'MINIVAN', 'ROADSTER')),
		availability        BOOLEAN     NOT NULL
	);
	`

	pool.query(carsTable, (err, res) => {
		if(!err){
		  console.log(result)
		}
		else {
		  console.log(err.message)
		}
	})
	
	let testValues = [
		1,
		'109b42f3-198d-4c89-9276-a7520a7120ab',
		'Mercedes Benz',
		'GLA 250',
		'ЛО777Х799',
		249,
		'SEDAN',
		3500,
		true
	]
	
	let testDataInsert = `
		INSERT INTO cars (id, car_uid, brand, model, registration_number, power, price, type, availability) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	
	pool.query(testDataInsert, testValues, (err, res) => {
		if(!err){
		  console.log(result)
		}
		else {
		  console.log(err.message)
		}
	})
	
}