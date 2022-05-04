'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
    static get objectIDs () { return [ 'category_id' ] }
}

module.exports = Course
