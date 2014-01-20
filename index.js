
try {
  var clone = require('clone');
} catch (e) {
  var clone = require('clone-component');
}

var is = require('is');
var isEmail = require('is-email');
var isUrl = require('is-url');

/**
 * Expose `Schema`.
 */

module.exports = exports = Schema;

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
 * Initialize a new `Schema` with optional existing `json`.
 *
 * @param {Object} json (optional)
 */

function Schema (json) {
  if (!(this instanceof Schema)) return new Schema(json);
  this.schema = json || {};
}

/**
 * Return a JSON repesentation of the schema.
 *
 * @return {Object}
 */

Schema.prototype.toJSON = function () {
  return clone(this.schema);
};

/**
 * Return a new `Schema`, adding a non-typed property by `key` with
 * optional `settings`.
 *
 * @param {String} key
 * @param {Object} settings (optional)
 * @return {Schema}
 */

Schema.prototype.add = function (key, settings) {
  settings = settings || {};

  // required - TODO: this should probably be in a plugin instead?
  if (settings.required) {
    settings.validators = settings.validators || [];
    settings.validators.push(function (val) { return val != null; });
  }

  var schema = this.toJSON();
  schema[key] = settings;
  return new Schema(schema);
};

/**
 * Return a new `Schema`, removing a property by `key`.
 *
 * @param {String} key
 * @return {Schema}
 */

Schema.prototype.remove = function (key) {
  var schema = this.toJSON();
  delete schema[key];
  return new Schema(schema);
};

/**
 * Generate methods for each type.
 */

for (var type in types) Schema.prototype[type] = generate(type, types[type]);

/**
 * Generate an attr definer given a `type` and `validator`.
 *
 * @param {String} type
 * @param {Function} validator
 */

function generate (type, validator) {

  /**
   * Return a new `Schema`, adding a property of `type` by `key` with
   * a `validator` and optional extra `settings`.
   *
   * @param {String} attr
   * @param {Object} settings (optional)
   */

  return function (key, settings) {
    settings = settings || {};
    settings.validators = settings.validators || [];
    settings.validators.push(validator);
    settings.type = type;
    return this.add(key, settings);
  };
}