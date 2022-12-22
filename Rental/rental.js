const express = require('express');
const { Pool } = require('pg');
const gateway = express();
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

gateway.use(bodyParser.json());
gateway.use(bodyParser.urlencoded({
  extended: true
})); 

gateway.get(path+'/manage/health', (request, response) => {
  response.status(200).send();
});

gateway.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Rental server works on port '+serverPortNumber);
})