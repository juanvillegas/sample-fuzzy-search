# Acronyms API

## Index

- [Design notes & considerations](#design-notes--considerations)
- [API](#api)
- [Installation & Execution](#installation)
- [Tests](#tests)

## Design notes & considerations

## Implementation

## API

### Retrieve Acronyms

**Endpoint:** `GET /acronym`

**Request**

Query parameters:

- search: string. Optional. Default: ''. If provided, it will be used to "fuzzy search" the acronyms database.
- limit: number. Optional. Default: 20. If provided, a maximum of `limit` results will be returned.
- from: number. Optional. Default: 0. If provided, the firsts `from` results will be skipped.

**Response**

If successful, the response will have the status code `200` and the following body:
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

### Delete Acronym

**Endpoint:** `DELETE /acronym/:value`

Deletes the Acronym identified by the value :value, if it exists.

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

If another Acronym with the given :value exists, a `422` error will be returned and the body of the response 
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

## Installation

Install dependencies first:

`npm install`

Then start the server using:

`PORT=$PORT npm run dev`

where $PORT is a number and represents the port where the API server will be expecting connections.

The above command will execute the API using `ts-node` to JIT-compile the typescript code.

The API will be available at `http://localhost:$PORT`.

### Using composer

The project contains the `Dockerfile` and `docker-compose.yml` files required to run the API in a container using Docker.
To do so, ensure Docker is running in the host machine and then execute from the Terminal:

`PORT=$PORT docker-compose up`

where $PORT is the desired port number you want to use to access the API. Once `docker-compose` has finished, 
the API will be available at `http://localhost:$PORT`.

## Tests

To run the test suite, execute:

`npm run test`
