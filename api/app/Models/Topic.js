'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Topic extends Model {
    subTemas () {
        return this.hasMany('App/Models/SubTopic', 'tema', 'topic_id')
    }
}

module.exports = Topic
