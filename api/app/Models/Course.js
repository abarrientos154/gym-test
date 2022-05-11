'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Course extends Model {
    static get objectIDs () { return [ 'category_id' ] }
    static get fillable() {
        return ['name', 'description', 'isEnabled', 'free', 'category_id', 'price1', 'price2', 'price3']
    }
}

module.exports = Course
