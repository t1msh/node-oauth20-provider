node-oauth2-provider
==================

OAuth 2.0 provider toolkit for nodeJS with connect/express support. Supports all the four authorization flows: authorization code, implicit, client credentials, password.

___Why should i use this library?___

- Fully customizable and extremely flexible
- Based on the final specification *[RFC6749](http://tools.ietf.org/html/rfc6749 "The OAuth 2.0 Authorization Framework Specification")*

## Installation ##

    $ npm install oauth2-provider

---------------------------------------

## Usage ##

> Look into ."/test/server/ directory" for working example with in-memory storage models.

### Step 1. Define your models ###

By default module sets abstract models which should be redefined (built in redis and mongo support wiil be available soon). Here is the list of them and their common schema (one can implement it in the other way, library does not force to do it that way):

### Refresh token ###

Refresh tokens are credentials used to obtain access tokens.  Refresh tokens are issued to the client by the authorization server and are used to obtain a new access token when the current access token becomes invalid or expires, or to obtain additional access tokens with identical or narrower scope (access tokens may have a shorter lifetime and fewer permissions than authorized by the resource owner). *[Read more](http://tools.ietf.org/html/rfc6749#section-1.5)*

___Model definition___

Primary key: **token**
Unique key: **userId** + **clientId** pair
```js
{
    userId:   { type: "object", required: true },
    clientId: { type: "object", required: true },
    token:    { type: "string", required: true, unique: true },
    scope:    { type: "array",  required: false,
        items:    { type: "string", enum: ["possible", "scope", "values"] }
    }
}
```

___Redefinable functions___
Look at "./lib/model/refreshToken.js" for further information.

### Access token ###

Access tokens are credentials used to access protected resources.  An access token is a string representing an authorization issued to the client.  The string is usually opaque to the client.  Tokens represent specific scopes and durations of access, granted by the resource owner, and enforced by the resource server and authorization server. *[Read more](http://tools.ietf.org/html/rfc6749#section-1.4)*

___Model definition___

Primary key: **token**
```js
{
    userId:   { type: "object", required: true },
    clientId: { type: "object", required: true },
    token:    { type: "string", required: true, unique: true },
    scope:  { type: "array", required: false,
        items: { type: "string", enum: ["possible", "scope", "values"] },
    }
}
```

___Redefinable functions___
Look at "./lib/model/accessToken.js" for further information.

### Client ###

Before initiating the protocol, the client registers with the authorization server.  The means through which the client registers with the authorization server are beyond the scope of this specification but typically involve end-user interaction with an HTML registration form. *[Read more](http://tools.ietf.org/html/rfc6749#section-2)*

___Model definition___

Primary key: **id**
```js
{
    id:    { type: "object", required: true, unique: true },
    name:   { type: "string", required: true },
    secret: { type: "string", required: true },
    uri:    { type: "string", required: false },
    scope:  { type: "array", required: false,
        items: { type: "string", enum: ["possible", "scope", "values"] },
    },
    grants: { type: "array", required: false,
        items: { type: "string", enum: ["authorization_code", "implicit", "password", "client_credentials"] }
    }
}
```

___Redefinable functions___
Look at "./lib/model/client.js" for further information.

### Code ###

The authorization code is obtained by using an authorization server as an intermediary between the client and resource owner. User only by authorization code flow, no need to initialize it if one dont use this grant. *[Read more](http://tools.ietf.org/html/rfc6749#section-1.3.1)*

___Model definition___

Primary key: **code**
Unique key: **userId** + **clientId** pair
```js
{
    userId:   { type: "object", required: true },
    clientId: { type: "object", required: true },
    code:    { type: "string", required: true, unique: true },
    scope:  { type: "array", required: false,
        items: { type: "string", enum: ["possible", "scope", "values"] },
    }
}
```

___Redefinable functions___
Look at "./lib/model/code.js" for further information.

### User ###

User is a registered person in the service. Model should contain unique identifier, password and sometimes additional unique key (for example username/email). There is no common scheme for this type of object, feel free to implement it your way.

___Redefinable functions___
Look at "./lib/model/user.js" for further information.

### Step 2. Inject and Define Endpoints ###

First of all include and initialize **oauth2-provider** library:
```js
oauth2 = require('./oauth2.js');
oauth2 = new oauth2lib({log: {level: 2}});

// We skip define models step here (read above or look at ./test/server/oauth2.js for information)
```

Inject oauth2 into your server
```js
server.use(oauth2.inject());
```

Library is compatible with express/connect servers.

___Token endpoint___

```js
server.post('/token', oauth2.controller.token);
```

___Authoirzation endpoint___

```js
server.get('/authorization', isAuthorized, oauth2.controller.authorization, function(req, res) {
    // Render our decision page
    // Look into ./test/server for further information
    res.render('authorization', {layout: false});
});
server.post('/authorization', isAuthorized, oauth2.controller.authorization);
```

Middleware **isAuthrorized** is used to check user login. If user is not logged in - show authorization form instead. Simple implementation:

```js
function isAuthorized(req, res, next) {
    if (req.session.authorized) return next();
    res.redirect('/login?' + query.stringify({backUrl: req.url}));
}
```

### Step 3. Relax ###

Your authorizaton server is ready for work.

---------------------------------------

### ToDo list and future plans ###

- More docs
- Build example site available from web
- More tests
- Add refresh token TTL
- Allow multiple flows for single client (only 1 per client works well yet)
- Implement proper "state" support
- Implement proper "TTL" support for accessToken and scope objects
- Add MAC token type
- Add built-in redis models
- Add built-in mongodb models
- Allow client authentication via query parameters
- Check RFC once more
- More tests

### License ###

Copyright (c) 2013 Tim Shamilov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.