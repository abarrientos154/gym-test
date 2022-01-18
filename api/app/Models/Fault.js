'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Fault extends Model {
  question () {
    return this.hasOne('App/Models/Question', 'question_id', '_id')
  }
  user () {
    return this.hasOne('App/Models/User', 'user_id', '_id')
  }
}

module.exports = Fault
