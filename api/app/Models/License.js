'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class License extends Model {
    course () {
        return this.hasOne('App/Models/Course', 'course_id', '_id')
    }

    userInfo () {
        return this.hasOne('App/Models/User', 'user_id', '_id')
    }
}

module.exports = License
