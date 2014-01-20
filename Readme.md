
# schema

  A simple, fluent API for generating immutable schemas.

## Installation

    $ component install component/schema

## Example

What's nice about your schemas being immutable is that it makes sharing them between different parts of your codebase very simple. For example, you might have a basic user schema:

```js
var Schema = require('schema');

var user = new Schema()
  .string('id', { required: true })
  .string('name')
  .email('email')
  .url('website')
  .date('created', { default: function () { return new Date(); }});

user.toJSON();
```
```js
{
  "id": {
    "type": "string",
    "required": true,
    "validators": [Function, Function],
  },
  "name": {
    "type": "string",
    "validators": [Function]
  },
  "email": {
    "type": "email",
    "validators": [Function]
  },
  "website": {
    "type": "url",
    "validators": [Function]
  },
  "created": {
    "type": "date",
    "validators": [Function]
  }
}
```

But then on your servers, you might want to add a few private properties to a user that you don't expose to the public:

```js
var user = require('user-schema');

var backendUser = user
  .number('version', { default: 0 })
  .boolean('admin', { default: false });
```

And in the browser, you might want to add a few conveniences:

```js
var user = require('user-schema');

var frontendUser = user
  .url('gravatar', { default: {} })
  .object('features', { default: {} });
```

And in your tests, you might want to have different defaults, so that creating generating fixtures is super simple:

```js
var user = require('user-schema');
var uid = require('uid');
var randomName = require('random-name');
var randomEmail = require('random-email');
var randomUrl = require('random-url');

var fixtureUser = user
  .string('id', { default: uid })
  .string('name', { default: randomName })
  .email('email', { default: randomEmail })
  .url('website', { default: randomWebsite });
```

## API

#### new Schema()

  Create a new `Schema`.

#### #<type>(key, settings)

  Return a new `Schema`, adding a property of `type` by `key` with optional extra `settings`. The supported types are:

    array
    boolean
    date
    function
    number
    object
    regexp
    string
    email
    url

#### #add(key, settings)

  Return a new `Schema`, adding a non-typed property by `key` with optional `settings`. If you pass a `required: true` setting, an required validator will be added.

#### #remove(key)

  Return a new `Schema`, removing a property by `key`.

#### #toJSON()

  Return a JSON representation of the schema.