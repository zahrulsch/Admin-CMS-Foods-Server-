# p2-cms-integration-server
CMS Integration - Server

&nbsp;

## RESTful endpoints


### GET /user

> Get active/login user

_Request header_
```
{
    'access_token': '<your access token>'
}
```
_Request body_

```
not needed
```
_Response (200)_
```
{
    "status": "success",
    "data": {
        "username": "zahrul",
        "role": "admin",
        "id": 4
    }
}
```
_Response (401)_
```
{
    "status": "error",
    "message": [
        "jwt must be provided"
    ]
}
```
_Response (500)_
```
{
    "status": "error",
    "message": [
        "internal server error"
    ]
}
```

### GET /users
> Get all users

_Request header_
```
{
    'access_token': '<your access token>'
}
```
_Request body_
```
not needed
```

_Response (200)_
```
{
    "status": "success",
    "data": [
        {
            "username": "Mantra Code",
            "email": "mantr4code@gmail.com",
            "address": "id",
            "phone": "Don't have a phone number"
        }
    ]
}
```

_Response (401)_
```
{
    "status": "error",
    "message": [
        "invalid token"
    ]
}
```
_Response (500)_
```
{
    "status": "error",
    "message": [
        "internal server error"
    ]
}
```

### POST /register
> Add new user as Administrator

_Request Header_
```
not needed
```

_Request Body_
```
{
    'username':'your username',
    'email':'your email',
    'password':'your password',
    'address':'your address',
    'phone':'your phone number'
}
```

_Response (201) Created_
```
{
    "status": "success",
    "id": 9,
    "email": "email@ymail.com"
}
```

_Response (400)_
```
{
    "status": "error",
    "message": "email has been used"
}
```
_Response (500)_
```
{
    "status": "error",
    "message": [
        "internal server error"
    ]
}
```

### POST /login
> Login user as Administrator

_Request Header_
```
not needed
```

_Request Body_
```
{
    'emai'l:'email@ymail.com',
    'password':'password'
}
```

_Response (200)_
```
{
    "status": "success",
    "access_token": "<your access token>"
}
```

_Response (401)_
```
{
    "status": "error",
    "message": [
        "unauthorized: you can't access"
    ]
}
```


### GET /foods

> Get all foods

_Request Header_
```
{
    'access_token': '<your access token>'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
[
    {
        "id": 6,
        "name": "<food name>",
        "description": "<food description>",
        "price": <food price>,
        "imgUrl": "<food imgUrl>",
        "AuthorId": 1,
        "CategoryId": 1,
        "createdAt": "2021-09-27T13:10:49.870Z",
        "updatedAt": "2021-09-27T13:10:49.870Z"
    },
    {
        "id": 8,
        "name": "<food name>",
        "description": "<food description>",
        "price": <food price>,
        "imgUrl": "<food image URL>",
        "AuthorId": 1,
        "CategoryId": 1,
        "createdAt": "2021-09-27T14:30:16.498Z",
        "updatedAt": "2021-09-27T14:30:16.498Z"
    }
]
```

_Response (401)_
```
{
    "status": "error",
    "message": [
        "unauthorized: you can't access"
    ]
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```
---
### POST /foods

> Create new foods

_Request Header_
```
not needed
```

_Request Body_
```
{
    "name": "<name to get insert into>",
    "description": "<description to get insert into>",
    "price": <price to get insert into>,
    "imgUrl": "<image URL to get insert into>",
    "AuthorId": <Author id to get insert into>,
    "CategoryId": <Category id to get insert into>,
}
```

_Response (201 - Created)_
```
{
    "id": <given id by system>,
    "name": "<posted name>",
    "description": "<posted description>",
    "price": <posted price>,
    "imgUrl": "<posted image URL>",
    "AuthorId": <posted Author id>,
    "CategoryId": <posted Category id>,
    "updatedAt": "2021-09-27T14:30:16.498Z",
    "createdAt": "2021-09-27T14:30:16.498Z"
}
```

_Response (400 - Bad Request)_
```
{
    "message": [
        "Validation notEmpty on price failed",
        "Validation isNumeric on price failed"
    ]
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```
---
### GET /foods/:id
> Get food by id

_Request Header_
```
{
    'access_token': '<your access token>'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "id": <given id by system>,
    "name": "<given name>",
    "description": "<given description>",
    "price": <given price>,
    "imgUrl": "<given image URL>",
    "AuthorId": <given Author id>,
    "CategoryId": <given Category id>,
    "updatedAt": "2021-09-27T14:30:16.498Z",
    "createdAt": "2021-09-27T14:30:16.498Z"
}
```

_Response (400 - Bad Request)_
```
{
    "message": [
        "Validation notEmpty on price failed",
        "Validation isNumeric on price failed"
    ]
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```
---
### PUT /foods/:id

> Update food by id

_Request Header_
```
{
    'access_token': '<your access token>'
}
```

_Request Body_
```
{
    "name": "<name to get update into>",
    "description": "<description to get update into>",
    "price": <price to get update into>,
    "imgUrl": "<image URL to get update into>",
    "AuthorId": <Author id to get update into>,
    "CategoryId": <Category id to get update into>,
}
```

_Response (200)_
```
{
    "id": <given id by system>,
    "name": "<updated name>",
    "description": "<updated description>",
    "price": <updated price>,
    "imgUrl": "<updated image URL>",
    "AuthorId": <updated Author id>,
    "CategoryId": <updated Category id>,
    "updatedAt": "2021-09-27T14:30:16.498Z",
    "createdAt": "2021-09-27T14:30:16.498Z"
}
```

_Response (400 - Bad Request)_
```
{
    "message": [
        "Validation notEmpty on price failed",
        "Validation isNumeric on price failed"
    ]
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```
---
### DELETE /foods/:id

> Delete food by id

_Request Header_
```
{
    'access_token': '<your access token>'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "message": "data with id 6 success to delete"
}
```

_Response (404 - Not Found)_
```
{
    "message": "data with id 7 is not found"
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```

### PATCH /foods/:id

> Update food status by id

_Request Header_
```
{
    'access_token': '<your access token>'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    "message": "data with id 6 success to delete"
}
```

_Response (404 - Not Found)_
```
{
    "message": "data with id 7 is not found"
}
```

_Response (500 - Internal Server Error)_
```
{
  "message": "internal server error"
}
```