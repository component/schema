
var assert = require('assert');

try {
  var Schema = require('schema');
} catch (e) {
  var Schema = require('..');
}

describe('schema', function () {

  it('should expose a constructor', function () {
    assert('function' == typeof Schema);
  });

  describe('.types', function () {
    it('should expose a dictionary of types', function () {
      assert(Schema.types);
      assert(Schema.types.array);
    });
  });

  describe('#schema', function () {
    it('should create an empty schema object', function () {
      var schema = Schema();
      assert.deepEqual({}, schema.schema);
    });
  });

  describe('#toJSON', function () {
    it('should return a clone of the schema', function () {
      var schema = Schema();
      var json = schema.toJSON();
      assert.notEqual(schema.schema, json);
      assert.deepEqual({}, json);
    });
  });

  describe('#add', function () {
    it('should return a new schema instance', function () {
      var one = Schema();
      var two = one.add('name');
      assert(one instanceof Schema);
      assert(two instanceof Schema);
      assert.notEqual(one, two);
    });

    it('should define a property with settings', function () {
      var schema = Schema().add('id', { setting: true });
      assert.deepEqual(schema.schema.id, {
        setting: true
      });
    });

    it('should add a required validator', function () {
      var schema = Schema().add('id', { required: true });
      assert.equal(1, schema.schema.id.validators.length);
    });

    it('should default settings to an object', function () {
      var schema = Schema().add('id');
      assert.deepEqual(schema.schema.id, {});
    });
  });

  describe('#remove', function () {
    it('should return a new schema instance', function () {
      var one = Schema().add('name');
      var two = one.remove('name');
      assert(one instanceof Schema);
      assert(two instanceof Schema);
      assert.notEqual(one, two);
    });

    it('should remove a property from the schema', function () {
      var schema = Schema().add('name').remove('name');
      assert(!schema.schema.name);
    });
  });

  for (var type in Schema.types) test(type, Schema.types[type]);

});

/**
 * Generate a test for a `type` with `validator`.
 *
 * @param {String} type
 * @param {Function} validator
 */

function test (type, validator) {
  describe('#' + type, function () {
    it('should return a new schema instance', function () {
      var one = Schema();
      var two = one[type]('name');
      assert(one instanceof Schema);
      assert(two instanceof Schema);
      assert.notEqual(one, two);
    });

    it('should define a property with settings', function () {
      var schema = Schema()[type]('name', { setting: true });
      assert.deepEqual(schema.schema.name, {
        setting: true,
        type: type,
        validators: [validator]
      });
    });
  });
}