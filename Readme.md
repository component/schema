
# cerberus

  A simple, fluent API for generating immutable schemas.

## Installation

    $ component install segmentio/cerberus
    $ npm install cerberus

## Example

```js
var Cerberus = require('cerberus');

var userSchema = new Cerberus()
  .string('id', { required: true })
  .string('name')
  .email('email')
  .url('website')
  .date('created');

userSchema.toJSON();
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

## API

#### new Cerberus()

  Create a new `Cerberus` schema.

#### #<type>(key, settings)

  Return a new `Cerberus` schema, adding a property of `type` by `key` with optional extra `settings`. The supported types are:

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

  Return a new `Cerberus` schema, adding a non-typed property by `key` with optional `settings`. If you pass a `required: true` setting, an required validator will be added.

#### #remove(key)

  Return a new `Cerberus` schema, removing a property by `key`.

#### #toJSON()

  Return a JSON representation of the schema.