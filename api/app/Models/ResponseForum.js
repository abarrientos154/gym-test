'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ResponseForum extends Model {
    static get objectIDs () { return [ '_id', 'question_id' ] }
    user () {
    return this.hasOne("App/Models/User", "user_id", "_id")
  }
}

module.exports = ResponseForum
