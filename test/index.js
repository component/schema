
var assert = require('assert');

try {
  var Cerberus = require('cerberus');
} catch (e) {
  var Cerberus = require('..');
}

describe('cerberus', function () {

  it('should expose a constructor', function () {
    assert('function' == typeof Cerberus);
  });

  describe('.types', function () {
    it('should expose a dictionary of types', function () {
      assert(Cerberus.types);
      assert(Cerberus.types.array);
    });
  });

  describe('#schema', function () {
    it('should create an empty schema object', function () {
      var cerberus = Cerberus();
      assert.deepEqual({}, cerberus.schema);
    });
  });

  describe('#toJSON', function () {
    it('should return a clone of the schema', function () {
      var cerberus = Cerberus();
      var schema = cerberus.toJSON();
      assert.notEqual(cerberus.schema, schema);
      assert.deepEqual({}, schema);
    });
  });

  describe('#attr', function () {
    it('should return a new cerberus instance', function () {
      var one = Cerberus();
      var two = one.attr('name');
      assert(one instanceof Cerberus);
      assert(two instanceof Cerberus);
      assert.notEqual(one, two);
    });

    it('should define an attr with settings', function () {
      var cerberus = Cerberus().attr('id', { required: true });
      assert.deepEqual(cerberus.schema.id, {
        name: 'id',
        required: true
      });
    });

    it('should default settings to an object', function () {
      var cerberus = Cerberus().attr('id');
      assert.deepEqual(cerberus.schema.id, { name: 'id' });
    });
  });

  describe('#remove', function () {
    it('should return a new cerberus instance', function () {
      var one = Cerberus().attr('name');
      var two = one.remove('name');
      assert(one instanceof Cerberus);
      assert(two instanceof Cerberus);
      assert.notEqual(one, two);
    });

    it('should remove an attr from the schema', function () {
      var cerberus = Cerberus().attr('name').remove('name');
      assert(!cerberus.schema.name);
    });
  });

  for (var type in Cerberus.types) test(type, Cerberus.types[type]);

});

/**
 * Generate a test for a `type` with `validator`.
 *
 * @param {String} type
 * @param {Function} validator
 */

function test (type, validator) {
  describe('#' + type, function () {
    it('should return a new cerberus instance', function () {
      var one = Cerberus();
      var two = one[type]('name');
      assert(one instanceof Cerberus);
      assert(two instanceof Cerberus);
      assert.notEqual(one, two);
    });

    it('should define an attr with settings', function () {
      var cerberus = Cerberus()[type]('name', { required: true });
      assert.deepEqual(cerberus.schema.name, {
        name: 'name',
        required: true,
        type: type,
        validator: validator
      });
    });
  });
}