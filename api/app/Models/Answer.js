'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Answer extends Model {
  course () {
    return this.hasOne('App/Models/Asignatura', 'family_id', '_id')
  }
}

module.exports = Answer
