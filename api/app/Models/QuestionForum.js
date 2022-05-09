'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class QuestionForum extends Model {
  user () {
    return this.hasOne("App/Models/User", "user_id", "_id")
  }
  forum () {
    return this.hasOne("App/Models/Forum", "forum_id", "_id")
  }
  responses () {
    return this.hasMany("App/Models/ResponseForum", "_id", "question_id")
  }
}



module.exports = QuestionForum
