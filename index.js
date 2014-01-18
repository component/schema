
try {
  var clone = require('clone');
} catch (e) {
  var clone = require('clone-component');
}

var is = require('is');
var isEmail = require('is-email');
var isUrl = require('is-url');

/**
 * Expose `Cerberus`.
 */

module.exports = exports = Cerberus;

/**
 * Expose `types`.
 */

var types = exports.types = {
  array: is.array,
  boolean: is.boolean,
  date: is.date,
  function: is.function,
  number: is.number,
  object: is.object,
  regexp: is.regexp,
  string: is.string,
  email: isEmail,
  url: isUrl
};

/**
 * Initialize a new `Cerberus` schema with optional existing `schema`.
 *
 * @param {Object} schema (optional)
 */

function Cerberus (schema) {
  if (!(this instanceof Cerberus)) return new Cerberus(schema);
  this.schema = schema || {};
}

/**
 * Return a JSON repesentation of the schema.
 *
 * @return {Object}
 */

Cerberus.prototype.toJSON = function () {
  return clone(this.schema);
};

/**
 * Return a new `Cerberus`, adding an `attr` with optional `settings`.
 *
 * @param {String} attr
 * @param {Object} settings (optional)
 * @return {Cerberus}
 */

Cerberus.prototype.attr = function (attr, settings) {
  settings = settings || {};
  settings.name = attr;
  var schema = this.toJSON();
  schema[attr] = settings;
  return new Cerberus(schema);
};

/**
 * Return a new `Cerberus` with `attr` removed from the schema.
 *
 * @param {String} attr
 * @return {Cerberus}
 */

Cerberus.prototype.remove = function (attr) {
  var schema = this.toJSON();
  delete schema[attr];
  return new Cerberus(schema);
};

/**
 * Generate methods for each type.
 */

for (var type in types) Cerberus.prototype[type] = generate(type, types[type]);

/**
 * Generate an attr definer given a `type` and `validator`.
 *
 * @param {String} type
 * @param {Function} validator
 */

function generate (type, validator) {

  /**
   * Create an `attr` with optional extra `settings`.
   *
   * @param {String} attr
   * @param {Object} settings (optional)
   */

  return function (attr, settings) {
    settings = settings || {};
    settings.type = type;
    settings.validator = validator;
    return this.attr(attr, settings);
  };
}