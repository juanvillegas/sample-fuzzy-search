# Acronyms API

## Index

- [Installation & Execution](#installation)
- [Design notes & considerations](#design-notes)
- [API](#api)
- [Tests](#tests)

## Installation

First, install dependencies:

`npm install`

Then, start the server using:

`PORT=$PORT npm run dev`

where $PORT is a number and represents the port where the API server will be listening for connections. Make sure this 
port is not used by other Applications. $PORT is mandatory, however a default `.env` file has been defined where PORT 
is assigned the default value 8888.

`npm run dev` will run the API using `ts-node` to compile the typescript code in runtime.

If successful, the API will be available at `http://localhost:$PORT`.

### Is it running?

There is a heartbeat endpoint to quickly verify that the API is up and running. Trigger a GET request to `/ping`, and 
the API will respond with `pong` if everything is working correctly.

### Using composer

The project contains the `Dockerfile` and `docker-compose.yml` files required to run the API in a container using Docker.
To do so, ensure Docker is running in the host machine and then execute the following from the terminal:

`PORT=$PORT docker-compose up`

where `$PORT` is the desired port number you want to use to access the API. Once `docker-compose` has finished,
the API will be available at `http://localhost:$PORT`.

## Design notes

Some design decisions that are worth mentioning:
- Abstract parent controller: this Class was introduced in order to define a common path to handle 
all the different requests in a predictable way. Using this parent controller as a base class, child controllers only 
need to redefine the required methods.
- Service Provider: a custom and very simple Service Provider function was introduced to be able to inject dependencies 
into controllers and services.
- Repository: to keep things simple, Acronyms are loaded from a file into an InMemoryRepository on startup. 
This basically means two things: 
  - all acronyms are stored in memory, and thus it is not suitable for really big collections.
  - when the server is restarted, the Acronym repository is also reloaded and thus any changes will be lost.

A high level overview of the system would look like this:

![acronyms](https://user-images.githubusercontent.com/773149/132495506-a285436d-4c6f-4bbd-858e-e02bae37ec12.jpg)

where requests flow from left to right, accessing through defined routes (`controllers/routes`). Routes execute middleware and ultimately delegate to a Controller
(see `controllers/getAcronyms/GetAcronymsController` for an example). Controllers follow a set of steps before processing the request, most importantly grabbing the request data and validating it (see `controllers/getAcronyms/GetAcronymsData` and `controllers/getAcronyms/GetAcronymsValidator` for examples). The controller will then delegate to a Service to handle the internal logic of dealing with Acronyms (`AcronymService`). Finally, the Service handles all the complex logic,
using a Repository (`/modules/acronym/repositories/`) to retrieve Acronym instances.
The Service Provider is a singleton that is available throughout the request providing concrete instance of Objects as needed.


## API

This section describes the available API endpoints, what parameters are supported and shows examples for using each of 
the endpoints.

### API Authentication

Some API endpoints require the client to authenticate by providing an Authorization header with the corresponding 
credentials. For simplicity, the API utilizes Authorization of type Basic, where the user has to provide an username and 
a password with every request in order to gain access. A map of valid usernames and passwords has been hardcoded in 
`modules/authorization/checkAuthorizationHeader` in order to simplify the solution.

**IMPORTANT NOTE: the author is aware that this doesn't represent a secure and production-grade authentication mechanism 
but the implementation of such a system is beyond the scope of this demo, and priority was set on dealing with the
Authorization header instead.**

In order to use protected endpoints, clients need to provide an additional `Authorization` header with the request. 
The value of the header must be set to `Basic`, followed by an empty space and the client's `username:password` combination 
encoded with Base64. For example, assuming username = u1 and password = 123123123, the request would have a Header like so:

`Authorization: Basic dTE6MTIzMTIzMTIz`

For reference, valid hardcoded username and password values are:
```
  USERNAME |  PASSWORD
  admin    | '123123123'
  user1    | '333333333'
```

### Retrieve Acronyms

**Endpoint:** `GET /acronym`

**Request**

Query parameters:

- search: string. Optional. Default: ''. If provided, it will be used to "fuzzy search" the acronyms database.
- limit: number. Optional. Default: 20. If provided, a maximum of `limit` results will be returned.
- from: number. Optional. Default: 0. If provided, the firsts `from` results will be skipped.

**Response**

If successful, the response will have the status code `200` and it's body will be an array of Acronyms:
```
[
  {
      "value": "some value", 
      "definition": "some definition"
  },
  ...
]
```

The response will also provide a `Link` header to indicate the URL of the next set of resources in 
case pagination is available. For example, if your result set contains 20 entries but `limit` was set to 10,
the `Link` header will be set to:

`Link: /acronym?from=10&limit=10, rel="next"`.

Use this header to retrieve subsequent pages when needed.
If the Link header is not returned, then it means that there is no additional pages to be queried.

### Delete Acronym

**Endpoint:** `DELETE /acronym/:value`

Deletes the Acronym identified by the value `:value`, if it exists.

**Request**

This endpoint requires Authentication. Check the [Authentication](#authentication) section for more information.

Parameters:

- value: string. Required. The value of the acronym to be deleted.

**Response**

If successful, the response will have the status code `200` and an empty body.

If the Acronym doesn't exist, the response will have the 404 status code.

**Examples**

To delete the "1UP" acronym:
```
DELETE /acronym/1UP HTTP/1.1
```

### Create Acronym

**Endpoint:** `POST /acronym`

Creates a new Acronym.

**Request**

Content-Type header of the request must be set to 'application/json'. 

Body Parameters:

- value: string. Max: 20 characters. Required. The value of the acronym to be created.
- definition: string. Max: 255 characters. Required. The definition of the acronym to be created.

**Response**

If successful, the response will have the status code `201` indicating that the resource has been 
correctly created and an empty body.

If another Acronym with the given `:value` exists, a `422` error will be returned and the body of the response 
will be set to 

```
{ "error": "resource_already_exists" }
```

**Examples**

To create a new Acronym with value `val` and definition `def` use:
```
POST /acronym HTTP/1.1
Content-Type: application/json
{
    "val": "val",
    "definition": "def"
}
```

### Update Acronym

**Endpoint:** `PUT /acronym/:value`

Updates an existing Acronym.

**Note: when providing a :value through the URL, make sure to URL-encode the values before.**

**Request**

Content-Type header of the request must be set to 'application/json'.

This endpoint requires Authentication. Check the [Authentication](#authentication) section for more information. 

Path parameters:

- value: string. Max: 20 characters. Required. The value of the acronym to be updated.
- 
Body Parameters:

- definition: string. Max: 255 characters. Required.

**Response**

If successful, the response will have the status code `200` and an empty body.

If the Acronym with the given :value doesn't exist, a `404` error will be returned and the body of the response 
will be set to 

```
{ "error": "not_found_error" }
```

**Examples**

To update an Acronym `acronym1`:
```
PUT /acronym/acronym1 HTTP/1.1
Content-Type: application/json
{
    "definition": "new definition for acronym 1"
}
```

## Tests

To run the test suite, execute:

`NODE_ENV=test npm run test`
