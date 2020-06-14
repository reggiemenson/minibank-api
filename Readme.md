
# Bank API

This project is a service for a basic simulated banking enviroment.

The API is a **Node.js** API built with a **postgreSQL** database.

The API has been built on macOS. Setup instructions will assume the same environment.

## Contents

1. [Installation](#Installation)
1. [Deployment](#Deployment)
1. [Using the API](#Using-the-API)

## Installation

Begin by cloning the repository:

`git clone <repo-name>`

This project makes use of a **Makefile** and **Docker**.

The database(s) has been containerized and can be spun up alongside the main application. 

If you do not have docker installed, please go ahead and install Docker by visiting their website [here](https://www.docker.com/). 

**If you do not use Docker, setup will require the installation and running of a local postgreSQL service.**

Lastly a *.env* file has been used and maintained through development. In order to replicate this on your local dev setup, create your own *.env* file and insert the following required variable values:

```
HOST=127.0.0.1
PORT=5000
DB_PORT=3432
DB_USER=postgres
DB_PASS=password

```

### Node

* Please make sure you have node installed on your machine. This service has been developed with **version v12.12.0**. It's important to have this version or later to maintain the expected results.

If you have brew installed, you can use it to install node by running:
`brew install node@12` (please note, in some cases there have been issues installing npm with brew and I would personally not recommended it)

The alternative is to go ahead and visit their website at [nodejs.org](https://nodejs.org/en/docs/)

Before you proceed make sure you have the **node package manager** command has been installed by running `which npm` or `npm -v` for the version number.

## Deployment

Use the commands in the **Makefile** to start up the development environment. **Make** commands should be available if you have [Xcode](https://developer.apple.com/xcode/) on your machine. A list of the commands needed are available in the next section.

You should now be set to start up the development environment. Run the following commands at the root of the project directory.

#### Setup commands in order

```
$ make install

$ make up

$ make test

$ make start

```

**Install command**

`make install`

This starts up Node Package Manager's install process. While the database is containerized, the API will be manually started.

**Up command**

`make up`

This command makes use of docker-compose and spins up two databases:
* one for testing
* one for running development

The current two database setup is to separate out the test database and the running one. This ultimately means any test data created does not make it into other environments.

A package called **cross-env** has been included to remove the requirement for manually updating testing environment variables. Simply run the commands and the scripts will take care of the db switch.


**Test command**

`make test`

This project makes use of **Supertest**, **Mocha** and **Chai** libraries to display more natural language test suites and demonstrate behaviour tests.

**Run command**

`make start`

or

`make run`

This starts the API!

`make run` enables reloading on saved changes through the use of **nodemon**, where as `make start` starts the API with the `node app.js` command.

## Using the API

This API accepts GET and POST requests. Query parameters change the information returned from the endpoints and will be detailed further down.

The available routes are as follows:

* /customers
* /accounts
* /accounts/transactions

| routes  | GET  | POST |
|---|---|---|
| /customers  |  X |   |
|  /accounts |  X |  X |
|  /accounts/transactions |  X |  X | 

**GET /customers**

```
$ curl http://localhost:5000/customers 
```

Making a request to the customers endpoint returns all customers with the following format:

```
{
  "customers": [
    {
      "id": 1,
      "name": "Bobbie Francis"
    },
    {
      "id": 2,
      "name": "Kerry Wells"
    },
    {
      "id": 3,
      "name": "Ira Watkins"
    },
    {
      "id": 4,
      "name": "Eddie Blake"
    }
  ],
  "message": null
}

```

Query paramaters can narrow the return to a single record:

```
$ curl http://localhost:5000/customers?id=1 
```

returns:

```
{
  "customers": [
    {
      "id": 1,
      "name": "Arisha Barron"
    }
  ],
  "message": null
}

```

**POST /accounts**

In order to create a new bank account simply include the customer creating the account for the request.

```
$ curl  -d '{ "id": "<custumer-id>", "balance": "<amount>" }' -X POST http://localhost:5000/accounts
```
*Note that balance is optional and defaults to 0 if not provided.*

**POST /accounts/transactions**

To transfer amounts between accounts, the account ids and an amount is required for the post request at the transactions endpoint.

```
$ curl  -d '{ "from": "<account-one-id>", "to": "<account-two-id>", "amount": "<amount>" }' -X POST http://localhost:5000/accounts/transactions

```

**GET /accounts?id='`<account-id>`**'

To retrieve balances for a given account make a GET request to the accounts endpoint with the account id as a query parameter.

```
$ curl http://localhost:5000/accounts?id=<account-id>
```

**GET /accounts/transactions?id='`<account-id>`'**

Transfer history can be requested by a GET request to the transactions endpoint with the account id as a query parameter.

```
$ curl http://localhost:5000/accounts/transactions?id=<account-id>
```

Routes have been designed to inform the user of bad paths, however testing error logging and durability continue to be developed.
