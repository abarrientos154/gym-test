'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Topic extends Model {
    subTemas () {
        return this.hasMany('App/Models/SubTopic', 'topic', 'topic_id')
    }
    audios () {
        return this.hasMany('App/Models/Audio', 'topic', 'topic')
    }
    questions () {
        return this.hasMany('App/Models/Question', 'topic', 'topic')
    }
}

module.exports = Topic
