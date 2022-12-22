const express = require('express');
const gateway = express();
const bodyParser = require('body-parser');

const path = '/api/v1';
const serverPortNumber = 8080;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

gateway.use(bodyParser.json());
gateway.use(bodyParser.urlencoded({
  extended: true
})); 

gateway.get(path+'/manage/health', (request, response) => {
  response.status(200).send();
});

gateway.get(path+'/cars', (request, response) => {
  response.status(200).send();
});

gateway.get(path+'/rental', (request, response) => {
  response.status(200).send();
});

gateway.get(path+'/rental/', (request, response) => {
  response.status(200).send();
});

gateway.listen(process.env.PORT || serverPortNumber, () => {
	console.log('Gateway server works on port '+serverPortNumber);
})