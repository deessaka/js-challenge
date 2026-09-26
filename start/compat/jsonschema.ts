import { Validator } from 'jsonschema'

/**
 * jsonschema 1.5.0 creates an invalid URL when resolving a schema without a
 * base URL. Node.js 24.20 started rejecting that URL, which prevents Ace from
 * loading application commands. Give schema validation a local-only base URL
 * until the dependency is updated.
 */
const validate = Validator.prototype.validate

Validator.prototype.validate = function (instance, schema, options, context) {
  if (options && options.base === undefined) {
    return validate.call(
      this,
      instance,
      schema,
      { ...options, base: 'http://jsonschema.invalid/' },
      context,
    )
  }

  return validate.call(this, instance, schema, options, context)
}
