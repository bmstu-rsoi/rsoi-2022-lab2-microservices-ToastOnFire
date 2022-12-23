const express = require('express');
const gateway = express();
const bodyParser = require('body-parser');

const path = '/api/v1';
const adress = {
	cars: 'http://cars:8070',
	payment: 'http://payment:8050',
	rental: 'http://rental:8060',
}
const serverPortNumber = 8080;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

gateway.use(bodyParser.json());
gateway.use(bodyParser.urlencoded({
  extended: true
})); 

gateway.get('/manage/health', (request, response) => {
	response.status(200).send();
});

gateway.get(path+'/cars', (request, response) => {
	let carsParams = {
		page: request.query.page,
		size: request.query.size,
		showAll: request.query.showAll
	}
	
	fetch(adress.cars+path+'/cars?' + new URLSearchParams(carsParams), {
		method: 'GET'
	})
	.then(result => result.json())
    .then(data => response.status(200).json(data));
});

gateway.get(path+'/rental', (request, response) => {
	let rentalParams = {
		username: request.headers['X-User-Name']
	}
	
	fetch(adress.cars+path+'/rental?' + new URLSearchParams(carsParams), {
		method: 'GET'
	})
	.then(result => result.json())
    .then(data => response.status(200).json(data));
});

gateway.get(path+'/rental/:rentalUid', (request, response) => {
	let rentalParams = {
		rentalUid: request.params.rentalUid,
		username: request.headers['X-User-Name']
	}
	
	fetch(adress.cars+path+'/rental_by_id?' + new URLSearchParams(carsParams), {
		method: 'GET'
	})
	.then(result => result.json())
    .then(data => response.status(200).json(data));
});

gateway.post(path+'/rental', (request, response) => {
	let rentalParams = {
		username: request.headers['X-User-Name'],
		carUid: request.body.carUid,
		dateFrom: request.body.dateFrom,
		dateTo: request.body.dateTo
	}
	
	fetch(adress.car+path+'/carcheck', {
		method: 'Post',
	body: JSON.stringify({carUid: rentalParams.carUid})
	})
	.then(result => {
		if (result.status == 200) {
			
		}
	})
});

gateway.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Gateway server works on port '+serverPortNumber);
})