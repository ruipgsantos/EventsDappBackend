---
title: Events Dapp v1.0.0
language_tabs:
  - javascript: JavaScript
  - javascript--node: Node.JS
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="events-dapp">Events Dapp v1.0.0</h1>

An Event Management Dapp with Metamask Login Support ONLY

# Authentication

* API Key (cookieAuth)
    - Parameter Name: **connect.sid**, in: cookie. 

<h1 id="events-dapp-events">Events</h1>

## get__events

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/events',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /events`

*Returns a list of Events, ordered by date descending*

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "name": "Mega Party at John/'s",
    "description": "It/'s a mega party and it/'s at John/'s",
    "location": "Merry Street, 24, Portland",
    "date": "2019-08-24",
    "spaceId": 0
  }
]
```

<h3 id="get__events-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|a JSON array of Events|Inline|

<h3 id="get__events-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Event](#schemaevent)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» name|string|false|none|none|
|» description|string|false|none|none|
|» location|string|false|none|none|
|» date|string(date)|false|none|none|
|» spaceId|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## post__events

> Code samples

```javascript
const inputBody = '{
  "id": 0,
  "name": "Mega Party at John/'s",
  "description": "It/'s a mega party and it/'s at John/'s",
  "location": "Merry Street, 24, Portland",
  "date": "2019-08-24",
  "spaceId": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/events',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /events`

*Updates or Creates the provided Event*

> Body parameter

```json
{
  "id": 0,
  "name": "Mega Party at John/'s",
  "description": "It/'s a mega party and it/'s at John/'s",
  "location": "Merry Street, 24, Portland",
  "date": "2019-08-24",
  "spaceId": 0
}
```

<h3 id="post__events-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Event](#schemaevent)|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "Mega Party at John/'s",
  "description": "It/'s a mega party and it/'s at John/'s",
  "location": "Merry Street, 24, Portland",
  "date": "2019-08-24",
  "spaceId": 0
}
```

<h3 id="post__events-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Event was successfully updated|[Event](#schemaevent)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - user is not authenticated|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - user does not own the affected relations|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
cookieAuth
</aside>

## get__events_space_{spaceId}

> Code samples

```javascript

fetch('/events/space/{spaceId}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /events/space/{spaceId}`

*Returns a list of Events that are related to a single spaceId*

<h3 id="get__events_space_{spaceid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|spaceId|path|integer(int64)|true|Id of the related Space|

<h3 id="get__events_space_{spaceid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|List of Events related to a specific Space|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Record not found|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="events-dapp-spaces">Spaces</h1>

## get__spaces

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/spaces',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /spaces`

*Returns a list of all Spaces*

> Example responses

> 200 Response

```json
[
  {
    "id": 5,
    "name": "John/'s Crib",
    "location": "Merry Street, 24",
    "active": true,
    "userID": 1
  }
]
```

<h3 id="get__spaces-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|The resulting list of Spaces|Inline|

<h3 id="get__spaces-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Space](#schemaspace)]|false|none|none|
|» id|integer(int64)|false|none|none|
|» name|string|false|none|none|
|» location|string|false|none|none|
|» active|boolean|false|none|none|
|» userID|number|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## put__spaces

> Code samples

```javascript
const inputBody = '{
  "id": 5,
  "name": "John/'s Crib",
  "location": "Merry Street, 24",
  "active": true,
  "userID": 1
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/spaces',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /spaces`

*Updates a Space info*

> Body parameter

```json
{
  "id": 5,
  "name": "John/'s Crib",
  "location": "Merry Street, 24",
  "active": true,
  "userID": 1
}
```

<h3 id="put__spaces-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[Space](#schemaspace)|true|none|

> Example responses

> 200 Response

```json
{
  "id": 5,
  "name": "John/'s Crib",
  "location": "Merry Street, 24",
  "active": true,
  "userID": 1
}
```

<h3 id="put__spaces-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Space was successfully updated|[Space](#schemaspace)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - user is not authenticated|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - user does not own the affected relations|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
cookieAuth
</aside>

## get__spaces_{spaceId}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/spaces/{spaceId}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /spaces/{spaceId}`

*Returns a specific Space*

<h3 id="get__spaces_{spaceid}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|spaceId|path|integer(int64)|true|Id of the related Space|

> Example responses

> 200 Response

```json
{
  "id": 5,
  "name": "John/'s Crib",
  "location": "Merry Street, 24",
  "active": true,
  "userID": 1
}
```

<h3 id="get__spaces_{spaceid}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returned Space|[Space](#schemaspace)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Record not found|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="events-dapp-user">User</h1>

## put__user

> Code samples

```javascript
const inputBody = '{
  "id": 1,
  "name": "John",
  "address": "0x9fB48802C9c9A187Df19AF823a792b909bec8576"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/user',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /user`

*Updates a user*

> Body parameter

```json
{
  "id": 1,
  "name": "John",
  "address": "0x9fB48802C9c9A187Df19AF823a792b909bec8576"
}
```

<h3 id="put__user-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[User](#schemauser)|true|none|

> Example responses

> 200 Response

```json
{
  "id": 1,
  "name": "John",
  "address": "0x9fB48802C9c9A187Df19AF823a792b909bec8576"
}
```

<h3 id="put__user-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|User was successfully updated|[User](#schemauser)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Unauthorized - user is not authenticated|None|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Forbidden - user does not own the affected relations|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
cookieAuth
</aside>

<h1 id="events-dapp-auth">Auth</h1>

## get__auth_nonce_{pubkey}

> Code samples

```javascript

fetch('/auth/nonce/{pubkey}',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /auth/nonce/{pubkey}`

*Gets a nonce which should be signed with the User's private key to beat the challenge*

<h3 id="get__auth_nonce_{pubkey}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|pubkey|path|[address](#schemaaddress)|true|public key/wallet address of the authenticating User|

<h3 id="get__auth_nonce_{pubkey}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|successfully got the nonce for signing|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__auth_login

> Code samples

```javascript
const inputBody = '{
  "pubkey": "0x9fB48802C9c9A187Df19AF823a792b909bec8576",
  "signedmsg": "string"
}';
const headers = {
  'Content-Type':'application/json'
};

fetch('/auth/login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /auth/login`

*Reads the provided public key with signed message and tries to log the User in*

> Body parameter

```json
{
  "pubkey": "0x9fB48802C9c9A187Df19AF823a792b909bec8576",
  "signedmsg": "string"
}
```

<h3 id="post__auth_login-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» pubkey|body|[address](#schemaaddress)|false|none|
|» signedmsg|body|string|false|The nonce returned by the previous login step, signed by the user's private key|

<h3 id="post__auth_login-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successfully logged in|None|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Failed to log in|None|

### Response Headers

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|200|Set-Cookie|undefined||none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_address">address</h2>
<!-- backwards compatibility -->
<a id="schemaaddress"></a>
<a id="schema_address"></a>
<a id="tocSaddress"></a>
<a id="tocsaddress"></a>

```json
"0x9fB48802C9c9A187Df19AF823a792b909bec8576"

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|none|

<h2 id="tocS_Event">Event</h2>
<!-- backwards compatibility -->
<a id="schemaevent"></a>
<a id="schema_Event"></a>
<a id="tocSevent"></a>
<a id="tocsevent"></a>

```json
{
  "id": 0,
  "name": "Mega Party at John/'s",
  "description": "It/'s a mega party and it/'s at John/'s",
  "location": "Merry Street, 24, Portland",
  "date": "2019-08-24",
  "spaceId": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|name|string|false|none|none|
|description|string|false|none|none|
|location|string|false|none|none|
|date|string(date)|false|none|none|
|spaceId|number|false|none|none|

<h2 id="tocS_Space">Space</h2>
<!-- backwards compatibility -->
<a id="schemaspace"></a>
<a id="schema_Space"></a>
<a id="tocSspace"></a>
<a id="tocsspace"></a>

```json
{
  "id": 5,
  "name": "John/'s Crib",
  "location": "Merry Street, 24",
  "active": true,
  "userID": 1
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|name|string|false|none|none|
|location|string|false|none|none|
|active|boolean|false|none|none|
|userID|number|false|none|none|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": 1,
  "name": "John",
  "address": "0x9fB48802C9c9A187Df19AF823a792b909bec8576"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer(int64)|false|none|none|
|name|string|false|none|none|
|address|[address](#schemaaddress)|false|none|none|

