'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
    static get objectIDs () { return [ 'category_id' ] }
    static get fillable() {
        return ['name', 'description', 'isEnabled', 'category_id', 'price']
    }
}

module.exports = Course
