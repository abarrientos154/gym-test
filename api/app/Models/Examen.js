'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Examen extends Model {
  static get fillable() {
    return ['name']
  }
  static fieldValidationRules() {
    const rules = {
      name: "required|string",
    }
    return rules
  }
  tests () {
    return this.hasMany('App/Models/Nivele', '_id', 'family_id')
  }
}

module.exports = Examen
