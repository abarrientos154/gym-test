'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TopicTest extends Model {
    testInfo () {
        return this.hasOne('App/Models/Topic', 'tema_id', 'id')
    }
}

module.exports = TopicTest
